import { Router } from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import SoilAnalysis from '../models/SoilAnalysis.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { FERTILIZER_DATABASE } from '../data/fertilizers.js';
import { CROP_DATABASE } from '../data/crops.js';
import { buildReportData, buildSoilIntelligenceData, generateReportId } from '../services/reportService.js';

const router = Router();
router.use(protect, authorize('admin'));

const safeUser = (user, analysisCount = 0) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  region: user.region || null,
  createdAt: user.createdAt,
  analysisCount,
});

const validId = (value) => mongoose.Types.ObjectId.isValid(value);
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const validDate = (value) => !value || !Number.isNaN(new Date(value).getTime());

router.get('/dashboard', async (req, res) => {
  try {
    const [totalUsers, totalAnalyses, totalReports, recentUsers, recentAnalyses, analysisCounts] = await Promise.all([
      User.countDocuments(),
      SoilAnalysis.countDocuments(),
      SoilAnalysis.countDocuments({ status: 'analyzed' }),
      User.find().select('name email role region createdAt').sort({ createdAt: -1 }).limit(5).lean(),
      SoilAnalysis.find().select('user createdAt crop soilType status prediction').populate('user', 'name email').sort({ createdAt: -1 }).limit(8).lean(),
      SoilAnalysis.aggregate([{ $group: { _id: '$user', count: { $sum: 1 } } }]),
    ]);

    const countMap = new Map(analysisCounts.map((item) => [item._id.toString(), item.count]));
    return res.json({
      success: true,
      statistics: {
        totalUsers,
        totalSoilAnalyses: totalAnalyses,
        totalReports,
        totalFertilizerRecords: FERTILIZER_DATABASE.length,
        totalCropRecords: CROP_DATABASE.length,
      },
      recentRegistrations: recentUsers.map((user) => safeUser(user, countMap.get(user._id.toString()) || 0)),
      recentAnalyses: recentAnalyses.map((analysis) => ({
        _id: analysis._id,
        user: analysis.user ? { name: analysis.user.name, email: analysis.user.email } : null,
        createdAt: analysis.createdAt,
        crop: analysis.crop,
        soilType: analysis.soilType,
        status: analysis.status,
        fertility: analysis.prediction?.fertilityLevel || null,
      })),
    });
  } catch (error) {
    console.error('Admin dashboard error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to load admin dashboard.' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const { search = '', role = 'all' } = req.query;
    const filter = role !== 'all' ? { role } : {};
    if (search.trim()) {
      filter.$or = [
        { name: { $regex: escapeRegex(search.trim()), $options: 'i' } },
        { email: { $regex: escapeRegex(search.trim()), $options: 'i' } },
      ];
    }
    const [users, analysisCounts] = await Promise.all([
      User.find(filter).select('name email role region createdAt').sort({ createdAt: -1 }).lean(),
      SoilAnalysis.aggregate([{ $group: { _id: '$user', count: { $sum: 1 } } }]),
    ]);
    const countMap = new Map(analysisCounts.map((item) => [item._id.toString(), item.count]));
    return res.json({ success: true, users: users.map((user) => safeUser(user, countMap.get(user._id.toString()) || 0)) });
  } catch (error) {
    console.error('Admin users error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to load users.' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(404).json({ success: false, message: 'User not found.' });
    const user = await User.findById(req.params.id).select('name email role region createdAt').lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    const analyses = await SoilAnalysis.find({ user: user._id }).select('createdAt crop soilType status prediction').sort({ createdAt: -1 }).limit(10).lean();
    return res.json({
      success: true,
      user: safeUser(user, analyses.length),
      statistics: { analysisCount: await SoilAnalysis.countDocuments({ user: user._id }), reportCount: await SoilAnalysis.countDocuments({ user: user._id, status: 'analyzed' }) },
      recentActivity: analyses,
    });
  } catch (error) {
    console.error('Admin user details error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to load user details.' });
  }
});

router.get('/soil-analyses', async (req, res) => {
  try {
    const { search = '', fertility = 'all', crop = 'all', from, to } = req.query;
    if (!validDate(from) || !validDate(to)) return res.status(400).json({ success: false, message: 'Invalid date filter.' });
    const filter = {};
    if (fertility !== 'all') filter['prediction.fertilityLevel'] = fertility;
    if (crop !== 'all') filter.crop = crop;
    if (from || to) filter.createdAt = { ...(from ? { $gte: new Date(from) } : {}), ...(to ? { $lte: new Date(to) } : {}) };
    if (search.trim()) filter.$or = [{ crop: { $regex: escapeRegex(search.trim()), $options: 'i' } }, { soilType: { $regex: escapeRegex(search.trim()), $options: 'i' } }];
    const analyses = await SoilAnalysis.find(filter).populate('user', 'name email').sort({ createdAt: -1 }).limit(200).lean();
    return res.json({ success: true, analyses: analyses.map((analysis) => ({ _id: analysis._id, user: analysis.user ? { name: analysis.user.name, email: analysis.user.email } : null, createdAt: analysis.createdAt, crop: analysis.crop, soilType: analysis.soilType, fertility: analysis.prediction?.fertilityLevel || null, soilHealthScore: analysis.status === 'analyzed' ? buildSoilIntelligenceData(analysis)?.soilHealthScore ?? null : null, status: analysis.status })) });
  } catch (error) {
    console.error('Admin analyses error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to load soil analyses.' });
  }
});

router.get('/reports', async (req, res) => {
  try {
    const analyses = await SoilAnalysis.find({ status: 'analyzed' }).populate('user', 'name email').sort({ createdAt: -1 }).limit(200).lean();
    return res.json({ success: true, reports: analyses.map((analysis, index) => { const report = buildReportData(analysis, analysis.user); return { reportId: generateReportId(index + 1, analysis.createdAt), analysisId: analysis._id, user: analysis.user ? { name: analysis.user.name, email: analysis.user.email } : null, analysisDate: analysis.createdAt, generatedAt: report?.generatedAt || null, fertility: analysis.prediction?.fertilityLevel || null, soilHealthScore: buildSoilIntelligenceData(analysis)?.soilHealthScore ?? null }; }) });
  } catch (error) {
    console.error('Admin reports error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to load reports.' });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const [registrations, analyses, fertility, crops, reportCount] = await Promise.all([
      User.aggregate([{ $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
      SoilAnalysis.aggregate([{ $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
      SoilAnalysis.aggregate([{ $match: { status: 'analyzed' } }, { $group: { _id: '$prediction.fertilityLevel', count: { $sum: 1 } } }]),
      SoilAnalysis.aggregate([{ $group: { _id: '$crop', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
      SoilAnalysis.countDocuments({ status: 'analyzed' }),
    ]);
    return res.json({ success: true, registrations, analyses, fertility, crops, reportCount });
  } catch (error) {
    console.error('Admin analytics error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to load system analytics.' });
  }
});

router.get('/fertilizers', (req, res) => res.json({ success: true, editable: false, message: 'Fertilizers are currently maintained as application data, not database records.', fertilizers: FERTILIZER_DATABASE }));
router.get('/crops', (req, res) => res.json({ success: true, editable: false, message: 'Crops are currently maintained as application data, not database records.', crops: CROP_DATABASE }));

router.get('/settings', (req, res) => res.json({ success: true, settings: { database: mongoose.connection.readyState === 1 ? 'Configured' : 'Not configured', mlService: process.env.ML_SERVICE_URL ? 'Configured' : 'Not configured', ocr: 'Not configured', applicationVersion: process.env.npm_package_version || 'Not available' } }));

export default router;
