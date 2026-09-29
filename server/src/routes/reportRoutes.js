import { Router } from 'express';
import SoilAnalysis from '../models/SoilAnalysis.js';
import { protect } from '../middleware/authMiddleware.js';
import { buildReportData, generateReportId, generateReportPdfBuffer } from '../services/reportService.js';

const router = Router();

const resolveReport = async (analysisId, userId) => {
  const analysis = await SoilAnalysis.findOne({
    _id: analysisId,
    user: userId,
    status: 'analyzed',
  }).populate('user', 'name email');

  if (!analysis) {
    return null;
  }

  const allReports = await SoilAnalysis.find({
    user: userId,
    status: 'analyzed',
  }).sort({ createdAt: -1 });

  const index = allReports.findIndex((item) => item._id.toString() === analysis._id.toString());
  const report = buildReportData(analysis, { name: analysis.user?.name || 'Farmer' });

  if (!report) {
    return null;
  }

  report.reportId = generateReportId(index >= 0 ? index + 1 : 1, analysis.createdAt);
  return report;
};

router.get('/', protect, async (req, res) => {
  try {
    const analyses = await SoilAnalysis.find({
      user: req.user._id,
      status: 'analyzed',
    }).sort({ createdAt: -1 });

    const reports = analyses
      .map((analysis, index) => {
        const report = buildReportData(analysis, req.user);
        if (!report) return null;
        report.reportId = generateReportId(index + 1, analysis.createdAt);
        return report;
      })
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to load soil reports.',
    });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const analysis = await SoilAnalysis.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: 'analyzed',
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Soil report not found.',
      });
    }

    const report = await resolveReport(analysis._id, req.user._id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Unable to generate report data for this analysis.',
      });
    }

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to load this report.',
    });
  }
});

router.get('/:id/pdf', protect, async (req, res) => {
  try {
    const analysis = await SoilAnalysis.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: 'analyzed',
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Report not found or access denied.',
      });
    }

    const report = await resolveReport(analysis._id, req.user._id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Unable to generate PDF for this report.',
      });
    }

    const pdfBuffer = await generateReportPdfBuffer(report);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${report.reportId}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    return res.status(200).send(pdfBuffer);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to generate your report PDF. Please try again.',
      error: error.message,
    });
  }
});

export default router;
