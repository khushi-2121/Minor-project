import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Bot, Download, FileText, Printer, ShieldAlert } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import { reportService } from '../services/reportService';

const formatDate = (value) => {
  if (!value) return 'Not available';
  return new Date(value).toLocaleString();
};

const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') return 'Not available';
  return Number(value).toFixed(value % 1 !== 0 ? 2 : 0);
};

const metricLabels = {
  nitrogen: 'Nitrogen',
  phosphorus: 'Phosphorus',
  potassium: 'Potassium',
  ph: 'pH',
  moisture: 'Moisture',
  organicCarbon: 'Organic Carbon',
  electricalConductivity: 'Electrical Conductivity',
};

const metricUnits = {
  nitrogen: 'mg/kg',
  phosphorus: 'mg/kg',
  potassium: 'mg/kg',
  ph: '',
  moisture: '%',
  organicCarbon: '%',
  electricalConductivity: 'dS/m',
};

export default function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unauthorized, setUnauthorized] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError('');
        setUnauthorized(false);

        const response = await reportService.getReportById(id);
        if (!response?.success || !response.report) {
          setError(response?.message || 'Unable to load this report.');
          return;
        }

        setReport(response.report);
      } catch (err) {
        if (err?.status === 401 || err?.message?.toLowerCase().includes('unauthorized')) {
          setUnauthorized(true);
          return;
        }

        setError(err?.message || 'Unable to load this report.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const soilMetrics = useMemo(() => {
    if (!report?.soilHealth?.metrics) return [];
    return report.soilHealth.metrics;
  }, [report]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await reportService.downloadReport(id);
    } catch (err) {
      setError(err?.message || 'Unable to generate your report. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <Container className="py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-12 w-72 rounded bg-slate-200" />
            <div className="h-40 rounded-xl bg-slate-200" />
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-28 rounded-xl bg-slate-200" />
              ))}
            </div>
          </div>
        </Container>
      </AppLayout>
    );
  }

  if (unauthorized) {
    return (
      <AppLayout>
        <Container className="py-16">
          <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <ShieldAlert className="mx-auto mb-4 text-red-600" size={40} />
            <h2 className="text-2xl font-semibold text-red-900">Unauthorized access</h2>
            <p className="mt-3 text-red-700">You are not authorized to view this report.</p>
            <Button onClick={() => navigate('/login')} className="mt-6">
              Return to login
            </Button>
          </div>
        </Container>
      </AppLayout>
    );
  }

  if (error || !report) {
    return (
      <AppLayout>
        <Container className="py-16">
          <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-600" size={40} />
            <h2 className="text-2xl font-semibold text-red-900">Unable to load report</h2>
            <p className="mt-3 text-red-700">{error || 'The requested report could not be found.'}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="secondary" onClick={() => navigate('/reports')}>
                Back to reports
              </Button>
              <Button onClick={() => navigate('/soil-analysis')}>Analyze soil</Button>
            </div>
          </div>
        </Container>
      </AppLayout>
    );
  }

  const printableData = {
    overallSoilCondition: report.summary?.overallSoilCondition || 'Not available',
    fertilityLevel: report.prediction?.fertilityLevel || 'Not available',
    soilHealthScore: report.summary?.soilHealthScore,
    keyConcern: report.summary?.keyConcern || 'Not available',
    recommendedAction: report.summary?.recommendedAction || 'Not available',
  };

  const riskAlerts = report.soilHealth?.riskAlerts || [];
  const fertilizerRecommendations = report.recommendations?.fertilizer?.recommendations || [];
  const cropRecommendations = report.recommendations?.crops?.recommendations || [];
  const improvementPlan = report.recommendations?.soilImprovement?.improvementPlan || {};

  return (
    <AppLayout>
      <div className="report-page">
        <Container className="py-8 print:py-0">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
            <Button variant="secondary" onClick={() => navigate('/reports')} className="gap-2">
              <ArrowLeft size={16} />
              Back to reports
            </Button>

            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={handleDownload} className="gap-2" disabled={downloading}>
                <Download size={16} />
                {downloading ? 'Preparing PDF...' : 'Download PDF'}
              </Button>
              <Button variant="secondary" onClick={() => window.print()} className="gap-2">
                <Printer size={16} />
                Print Report
              </Button>
              <Button onClick={() => navigate('/ai-assistant', { state: { reportId: id } })} className="gap-2">
                <Bot size={16} />
                Ask AgriSense AI About This Report
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">AgriSense AI</p>
                  <h1 className="mt-2 text-3xl font-bold text-slate-900">Smart Soil Health Report</h1>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-right">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Report ID</p>
                  <p className="mt-1 text-lg font-bold text-emerald-900">{report.reportId || 'N/A'}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Report date</p>
                  <p className="mt-2 font-semibold text-slate-900">{formatDate(report.createdAt)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Analysis ID</p>
                  <p className="mt-2 font-semibold text-slate-900">{report.analysisId || 'Not available'}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">User</p>
                  <p className="mt-2 font-semibold text-slate-900">{report.userName || 'Farmer'}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Crop</p>
                  <p className="mt-2 font-semibold text-slate-900">{report.crop || 'Not available'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-8 p-6">
              <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-xl font-semibold text-slate-900">Report Summary</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  <div className="rounded-xl bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Overall Soil Condition</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">{printableData.overallSoilCondition}</p>
                  </div>
                  <div className="rounded-xl bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fertility Level</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">{printableData.fertilityLevel}</p>
                  </div>
                  <div className="rounded-xl bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Soil Health Score</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">
                      {printableData.soilHealthScore !== null && printableData.soilHealthScore !== undefined ? `${printableData.soilHealthScore}/100` : 'Not available'}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white p-4 md:col-span-2 xl:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Key Concern</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{printableData.keyConcern}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Recommended Action</p>
                  <p className="mt-2 text-sm text-emerald-900">{printableData.recommendedAction}</p>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-xl font-semibold text-slate-900">Soil Analysis</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {Object.entries(metricLabels).map(([key, label]) => (
                    <div key={key} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                      <p className="mt-2 text-lg font-bold text-slate-900">
                        {report.data?.[key] !== null && report.data?.[key] !== undefined && report.data?.[key] !== '' ? `${formatNumber(report.data[key])}${metricUnits[key] ? ` ${metricUnits[key]}` : ''}` : 'Not available'}
                      </p>
                    </div>
                  ))}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Soil Type</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">{report.soilType || 'Not available'}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Location</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">{report.location || 'Not available'}</p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-xl font-semibold text-slate-900">AI Prediction</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Fertility Level</p>
                    <p className="mt-2 text-3xl font-bold text-emerald-900">{report.prediction?.fertilityLevel || 'Not available'}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Confidence</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">
                      {report.prediction?.confidence !== null && report.prediction?.confidence !== undefined ? `${(Number(report.prediction.confidence) * 100).toFixed(1)}%` : 'Not available'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Model Name</p>
                    <p className="mt-2 font-semibold text-slate-900">{report.prediction?.modelName || 'Not available'}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Model Version</p>
                    <p className="mt-2 font-semibold text-slate-900">{report.prediction?.modelVersion || 'Not available'}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Prediction Date</p>
                    <p className="mt-2 font-semibold text-slate-900">{report.prediction?.predictedAt ? formatDate(report.prediction.predictedAt) : 'Not available'}</p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-xl font-semibold text-slate-900">Soil Health Score</h2>
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">
                    {report.soilHealth?.score !== null && report.soilHealth?.score !== undefined ? `Soil Health Score / 100: ${report.soilHealth.score}/100` : 'Not available for this analysis.'}
                  </p>
                </div>
                {soilMetrics.length > 0 && (
                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {soilMetrics.map((metric) => (
                      <div key={metric.metric} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{metricLabels[metric.metric] || metric.metric}</p>
                        <p className="mt-2 text-lg font-bold text-slate-900">{metric.score ?? 'Not available'}</p>
                        <p className="mt-1 text-xs text-slate-600">{metric.label || 'Status unavailable'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-xl font-semibold text-slate-900">Nutrient Status</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nitrogen</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">{report.nutrientStatus?.nitrogen || 'Not available'}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phosphorus</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">{report.nutrientStatus?.phosphorus || 'Not available'}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Potassium</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">{report.nutrientStatus?.potassium || 'Not available'}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">pH Status</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">{report.nutrientStatus?.ph || 'Not available'}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Moisture Status</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">{report.nutrientStatus?.moisture || 'Not available'}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Organic Carbon Status</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">{report.nutrientStatus?.organicCarbon || 'Not available'}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2 xl:col-span-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">EC Status</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">{report.nutrientStatus?.electricalConductivity || 'Not available'}</p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-xl font-semibold text-slate-900">Soil Risk Alerts</h2>
                {riskAlerts.length > 0 ? (
                  <ul className="mt-4 space-y-3">
                    {riskAlerts.map((alert, index) => (
                      <li key={`${alert.title}-${index}`} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <p className="font-semibold text-amber-900">{alert.title}</p>
                        <p className="mt-1 text-sm text-amber-800">{alert.detail}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">No major risk indicators detected by the current analysis.</p>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-xl font-semibold text-slate-900">Fertilizer Recommendations</h2>
                {fertilizerRecommendations.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {fertilizerRecommendations.map((item) => (
                      <div key={item.fertilizerId || item.fertilizer} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <p className="text-lg font-semibold text-slate-900">{item.fertilizer || 'Unknown fertilizer'}</p>
                          <span className="inline-flex w-fit rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">{item.priority || 'Medium'}</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{item.category || 'General'} • {item.reason || 'General guidance'}</p>
                        <p className="mt-2 text-sm text-slate-700">Nutrients supplied: {item.composition || 'Not available'}</p>
                        <p className="mt-2 text-sm text-slate-700">General guidance: {item.applicationGuidance || 'Not available'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-700">No fertilizer recommendations are available for this analysis.</p>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-xl font-semibold text-slate-900">Crop Compatibility</h2>
                {cropRecommendations.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {cropRecommendations.map((crop) => (
                      <div key={crop.crop || crop.name} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-lg font-semibold text-slate-900">{crop.crop || crop.name || 'Crop'}</p>
                        <p className="mt-2 text-sm text-slate-700">Compatibility Score: {crop.compatibilityScore ?? 'Not available'}</p>
                        <p className="mt-2 text-sm text-slate-700">Reasons: {crop.reasons?.join(', ') || 'Not available'}</p>
                        <p className="mt-2 text-sm text-slate-700">Limitations: {crop.limitations?.join(', ') || 'Not available'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-700">No crop compatibility results are available for this analysis.</p>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-xl font-semibold text-slate-900">Soil Improvement Plan</h2>
                <div className="mt-4 space-y-4">
                  {Object.keys(improvementPlan).length > 0 ? (
                    Object.entries(improvementPlan).map(([key, value]) => (
                      <div key={key} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-lg font-semibold text-slate-900">{value?.section || key}</p>
                        <p className="mt-2 text-sm text-slate-600">{value?.description || 'Details available in the project recommendation data.'}</p>
                        {value?.recommendations?.length ? (
                          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                            {value.recommendations.slice(0, 3).map((item, idx) => (
                              <li key={`${key}-${idx}`}>{item.action || item.nutrient || 'Recommendation detail'}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-700">Soil improvement recommendations are not available for this analysis.</p>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-xl font-semibold text-slate-900">AgriSense AI Insights</h2>
                <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  {report.aiInsights || 'AI insights are not available for this report.'}
                </p>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-xl font-semibold text-slate-900">Disclaimer</h2>
                <p className="mt-4 text-sm leading-6 text-slate-700">{report.disclaimer}</p>
              </section>
            </div>
          </div>
        </Container>
      </div>
    </AppLayout>
  );
}
