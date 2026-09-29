import { useEffect, useState } from 'react';
import { AlertTriangle, ArrowRight, BarChart3, FileText, Leaf, RefreshCw, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Container from '../components/common/Container';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/common/Button';
import { dashboardService } from '../services/dashboardService';
import { useLanguage } from '../i18n/index.jsx';

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : 'Not available');
const formatChartDate = (value) => (value ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '');
const displayValue = (value, suffix = '') => (value === null || value === undefined || value === '' ? 'Not available' : `${value}${suffix}`);

function SkeletonCard({ className = '' }) {
  return <div className={`animate-pulse rounded-2xl border border-slate-200 bg-white p-6 ${className}`}><div className="h-5 w-40 rounded bg-slate-200" /><div className="mt-5 h-10 w-28 rounded bg-slate-200" /><div className="mt-4 h-4 w-full rounded bg-slate-100" /></div>;
}

function SectionCard({ title, icon: Icon, children, className = '' }) {
  return <section className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}><div className="mb-5 flex items-center justify-between"><h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">{Icon && <Icon size={19} className="text-emerald-600" />}{title}</h2></div>{children}</section>;
}

function EmptyState({ message, actionLabel, actionTo }) {
  return <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-7 text-center"><p className="text-sm text-slate-600">{message}</p>{actionLabel && <Button to={actionTo} className="mt-4 rounded-xl">{actionLabel}</Button>}</div>;
}

function DashboardContent({ data }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const latest = data.latestAnalysis;
  const latestAnalyzed = latest?.status === 'analyzed' ? latest : data.recentAnalyses.find((analysis) => analysis.status === 'analyzed');
  const recommendations = data.recommendations;
  const fertilizer = recommendations?.fertilizer?.recommendations?.[0];
  const crop = recommendations?.crops?.cropRecommendations?.bestMatches?.[0] || recommendations?.crops?.cropRecommendations?.goodMatches?.[0];
  const improvement = recommendations?.soilImprovement?.improvementPlan?.nutrientManagement?.recommendations?.[0];
  const hasAnalyses = data.recentAnalyses.length > 0;
  const healthTrend = data.healthTrend.map((point) => ({ ...point, label: formatChartDate(point.date) }));
  const nutrientTrend = data.nutrientTrend.map((point) => ({ ...point, label: formatChartDate(point.date) }));

  return <>
    <div className="border-b border-slate-200 bg-white px-6 py-8"><Container><p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">{t('dashboard.soilIntelligence')}</p><h1 className="mt-3 text-3xl font-bold text-slate-900">{new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'}, <span className="text-emerald-700">{data.user.name}</span></h1><p className="mt-2 text-slate-600">{t('dashboard.overview')}</p><div className="mt-6 flex flex-wrap gap-3"><Button to="/soil-analysis" className="rounded-xl"><Leaf size={16} />{t('common.analyzeSoil')}</Button><Button to="/soil-analysis/upload-report" variant="secondary" className="rounded-xl"><FileText size={16} />{t('common.uploadSoilReport')}</Button><Button to="/reports" variant="secondary" className="rounded-xl">{t('common.viewReports')}</Button><Button to="/ai-assistant" variant="secondary" className="rounded-xl"><Sparkles size={16} />{t('dashboard.askAi')}</Button></div></Container></div>

    <Container className="py-8">
      {!hasAnalyses ? <section className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-8"><div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">{t('dashboard.soilIntelligence')}</p><h2 className="mt-3 text-3xl font-bold text-slate-900">{t('dashboard.journeyTitle')}</h2><p className="mt-3 text-slate-700">{t('dashboard.journeyDescription')}</p><div className="mt-6 flex flex-wrap gap-3"><Button to="/soil-analysis" className="rounded-xl">{t('common.analyzeSoil')}</Button><Button to="/soil-analysis/upload-report" variant="secondary" className="rounded-xl">{t('common.uploadSoilReport')}</Button></div></div></section> : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[[t('dashboard.totalAnalyses'), data.statistics.totalAnalyses ?? t('common.notAvailable')], [t('dashboard.totalReports'), data.statistics.totalReports ?? t('common.notAvailable')], [t('dashboard.latestFertility'), data.statistics.latestFertilityLevel || t('common.notAvailable')], [t('dashboard.latestSoilHealth'), data.statistics.latestSoilHealthScore === null ? t('common.notAvailable') : displayValue(data.statistics.latestSoilHealthScore, '/100')]].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p><p className="mt-3 text-2xl font-bold text-slate-900">{value}</p></div>)}</div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3"><SectionCard title={t('dashboard.soilHealthOverview')} icon={BarChart3} className="lg:col-span-2">{!latestAnalyzed ? <EmptyState message={t('common.noAnalysis')} actionLabel={t('common.analyzeYourSoil')} actionTo="/soil-analysis" /> : <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center"><div className="text-center md:border-r md:border-slate-200 md:pr-6"><p className="text-sm font-medium text-slate-500">{t('dashboard.soilHealthScore')}</p><p className="mt-2 text-6xl font-bold text-emerald-700">{displayValue(latestAnalyzed.soilHealthScore)}</p><p className="text-sm text-slate-500">/100</p></div><div className="grid gap-4 sm:grid-cols-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t('dashboard.fertilityLevel')}</p><p className="mt-2 font-semibold text-slate-900">{latestAnalyzed.fertilityLevel || t('common.notAvailable')}</p></div><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t('dashboard.lastAnalysis')}</p><p className="mt-2 font-semibold text-slate-900">{formatDate(latestAnalyzed.createdAt)}</p></div><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t('dashboard.soilType')}</p><p className="mt-2 font-semibold text-slate-900">{latestAnalyzed.soilType || t('common.notAvailable')}</p></div></div></div>}</SectionCard><SectionCard title={t('dashboard.aiInsights')} icon={Sparkles}><div className="flex min-h-36 flex-col justify-between"><p className="text-sm leading-6 text-slate-600">{t('dashboard.noAiInsights')}</p><Button to="/ai-assistant" variant="secondary" className="mt-5 w-fit rounded-xl">{t('dashboard.askAi')}</Button></div></SectionCard></div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2"><SectionCard title="Nutrient Overview" icon={Leaf}>{!latestAnalyzed ? <EmptyState message="No nutrient data available yet." actionLabel="Analyze Soil" actionTo="/soil-analysis" /> : <><div className="grid gap-4 sm:grid-cols-3">{[['Nitrogen', latestAnalyzed.nutrients.nitrogen, latestAnalyzed.nutrientStatus?.nitrogen], ['Phosphorus', latestAnalyzed.nutrients.phosphorus, latestAnalyzed.nutrientStatus?.phosphorus], ['Potassium', latestAnalyzed.nutrients.potassium, latestAnalyzed.nutrientStatus?.potassium]].map(([label, value, status]) => <div key={label} className="rounded-xl bg-slate-50 p-4"><p className="text-sm font-medium text-slate-600">{label}</p><p className="mt-2 text-2xl font-bold text-slate-900">{displayValue(value)}</p><p className="mt-1 text-xs text-emerald-700">{status || 'Not available'}</p></div>)}</div><div className="mt-6 h-56"><ResponsiveContainer width="100%" height="100%"><BarChart data={[{ name: 'Latest', N: latestAnalyzed.nutrients.nitrogen, P: latestAnalyzed.nutrients.phosphorus, K: latestAnalyzed.nutrients.potassium }]}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="N" fill="#059669" /><Bar dataKey="P" fill="#0ea5e9" /><Bar dataKey="K" fill="#f59e0b" /></BarChart></ResponsiveContainer></div></>}</SectionCard><SectionCard title="Soil Condition" icon={Leaf}>{!latestAnalyzed ? <EmptyState message="No soil condition data available yet." actionLabel="Analyze Soil" actionTo="/soil-analysis" /> : <div className="grid gap-4 sm:grid-cols-2">{[['pH', latestAnalyzed.condition.ph], ['Moisture', latestAnalyzed.condition.moisture, '%'], ['Organic Carbon', latestAnalyzed.condition.organicCarbon, '%'], ['Electrical Conductivity', latestAnalyzed.condition.electricalConductivity], ['Soil Type', latestAnalyzed.condition.soilType]].map(([label, value, suffix = '']) => <div key={label} className="rounded-xl border border-slate-200 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 font-semibold text-slate-900">{displayValue(value, suffix)}</p></div>)}</div>}</SectionCard></div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2"><SectionCard title="Recent Soil Analyses" icon={BarChart3}>{data.recentAnalyses.length === 0 ? <EmptyState message="No soil analyses yet." actionLabel="Start Your First Analysis" actionTo="/soil-analysis" /> : <div className="space-y-3">{data.recentAnalyses.map((analysis) => <div key={analysis._id} className="rounded-xl border border-slate-200 p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-slate-900">{analysis.crop || 'Not available'}</p><p className="mt-1 text-xs text-slate-500">{formatDate(analysis.createdAt)} Â· {analysis.soilType || 'Not available'}</p></div>{analysis.status === 'analyzed' ? <Button to={`/reports/${analysis._id}`} variant="secondary" className="rounded-xl">View Report</Button> : <span className="text-sm text-slate-500">{analysis.status || 'Processing'}</span>}</div><div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3"><span>Fertility: <strong>{analysis.fertilityLevel || 'Not available'}</strong></span><span>Health: <strong>{displayValue(analysis.soilHealthScore, '/100')}</strong></span><span>Location: <strong>{analysis.location || 'Not available'}</strong></span></div></div>)}</div>}</SectionCard><SectionCard title="Latest Recommendations" icon={Leaf}>{!recommendations ? <EmptyState message="No recommendations available yet." actionLabel="Analyze Soil" actionTo="/soil-analysis" /> : <div className="space-y-3">{[['Fertilizer recommendation', fertilizer?.fertilizer || fertilizer?.reason, '/recommendations/fertilizer'], ['Crop recommendation', crop?.name || crop?.reason, '/recommendations/crops'], ['Soil improvement action', improvement?.actions?.[0] || improvement?.action, '/recommendations/soil-improvement']].map(([label, value, to]) => <div key={label} className="flex items-start justify-between gap-4 rounded-xl bg-slate-50 p-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-sm font-medium text-slate-900">{value || 'Not available'}</p></div><Link to={to} className="shrink-0 text-sm font-semibold text-emerald-700 hover:text-emerald-800">View Details</Link></div>)}</div>}</SectionCard></div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2"><SectionCard title="Soil Health Trend" icon={BarChart3}>{healthTrend.length === 0 ? <EmptyState message="No soil health history available yet." actionLabel="Analyze Soil" actionTo="/soil-analysis" /> : <><div className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={healthTrend}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="label" /><YAxis domain={[0, 100]} /><Tooltip /><Line type="monotone" dataKey="score" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} /></LineChart></ResponsiveContainer></div>{healthTrend.length === 1 && <p className="mt-3 text-sm text-slate-500">More analyses will create a meaningful trend.</p>}</>}</SectionCard><SectionCard title="NPK Trend" icon={BarChart3}>{nutrientTrend.length === 0 ? <EmptyState message="No nutrient history available yet." actionLabel="Analyze Soil" actionTo="/soil-analysis" /> : <div className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={nutrientTrend}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="label" /><YAxis /><Tooltip /><Line type="monotone" dataKey="nitrogen" name="Nitrogen" stroke="#059669" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="phosphorus" name="Phosphorus" stroke="#0ea5e9" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="potassium" name="Potassium" stroke="#f59e0b" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div>}</SectionCard></div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.5fr]"><SectionCard title="Soil Risk Alerts" icon={AlertTriangle}>{data.riskAlerts.length === 0 ? <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-600">No major risk indicators detected by the current analysis.</p> : <div className="space-y-3">{data.riskAlerts.map((alert, index) => <div key={`${alert.title}-${index}`} className="rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="font-semibold text-amber-900">{alert.title}</p><p className="mt-1 text-sm text-amber-800">{alert.detail}</p></div>)}</div>}</SectionCard><SectionCard title="Recent Reports" icon={FileText}>{data.reports.length === 0 ? <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-600">No reports generated yet.</p> : <div className="grid gap-3 sm:grid-cols-2">{data.reports.map((report) => <button key={report.analysisId} onClick={() => navigate(`/reports/${report.analysisId}`)} className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left hover:border-emerald-300"><span><strong className="block text-sm text-slate-900">{report.reportId}</strong><span className="text-xs text-slate-500">{report.crop || 'Not available'} Â· {formatDate(report.createdAt)}</span></span><ArrowRight size={16} className="text-emerald-700" /></button>)}</div>}</SectionCard></div>
    </Container>
  </>;
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadDashboard = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await dashboardService.getDashboard();
      if (!response?.success) throw new Error('dashboard');
      setData(response);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  return <AppLayout>{loading ? <Container className="grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4"><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard className="sm:col-span-2" /><SkeletonCard className="sm:col-span-2" /></Container> : error ? <Container className="py-16"><div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-8 text-center"><AlertTriangle className="mx-auto text-red-600" size={36} /><h1 className="mt-4 text-2xl font-bold text-red-900">Unable to load your soil intelligence data.</h1><Button onClick={loadDashboard} className="mt-6 rounded-xl"><RefreshCw size={16} />Try Again</Button></div></Container> : <DashboardContent data={data} />}</AppLayout>;
}
