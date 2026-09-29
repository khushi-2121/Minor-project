import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, BarChart3, CheckCircle, Clock, Leaf, ShieldAlert } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import { soilAnalysisService } from '../services/soilAnalysisService';
import { buildSoilIntelligenceData } from '../services/soilIntelligenceService';

const statusVariants = {
  processing: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Clock,
    label: 'Processing',
  },
  analyzed: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle,
    label: 'Analyzed',
  },
  failed: {
    badge: 'bg-red-50 text-red-700 border-red-200',
    icon: AlertCircle,
    label: 'Failed',
  },
};

const metricConfig = {
  nitrogen: { label: 'Nitrogen', unit: 'mg/kg' },
  phosphorus: { label: 'Phosphorus', unit: 'mg/kg' },
  potassium: { label: 'Potassium', unit: 'mg/kg' },
  ph: { label: 'pH', unit: '' },
  moisture: { label: 'Moisture', unit: '%' },
  organicCarbon: { label: 'Organic Carbon', unit: '%' },
  electricalConductivity: { label: 'Electrical Conductivity', unit: 'dS/m' },
};

const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') return 'Not available';
  return Number(value).toFixed(value % 1 !== 0 ? 2 : 0);
};

const renderValue = (value) => {
  if (value === null || value === undefined || value === '') return 'Not available';
  return value;
};

export default function HistoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError('');
        setUnauthorized(false);

        const response = await soilAnalysisService.getAnalysisById(id);

        if (!response?.success || !response.analysis) {
          setError(response?.message || 'Unable to load this soil analysis.');
          return;
        }

        setAnalysis(response.analysis);
      } catch (err) {
        if (err?.status === 401 || err?.message?.toLowerCase().includes('unauthorized')) {
          setUnauthorized(true);
          return;
        }

        setError(err?.message || 'Unable to load this soil analysis.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  const intelligence = useMemo(() => {
    if (!analysis) return null;
    return buildSoilIntelligenceData(analysis);
  }, [analysis]);

  if (loading) {
    return (
      <AppLayout>
        <Container className="py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-56 rounded bg-slate-200" />
            <div className="h-28 rounded-xl bg-slate-200" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-28 rounded-xl bg-slate-200" />
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
            <p className="mt-3 text-red-700">You are not authorized to view this soil analysis record.</p>
            <Button onClick={() => navigate('/login')} className="mt-6">
              Return to Login
            </Button>
          </div>
        </Container>
      </AppLayout>
    );
  }

  if (error || !analysis) {
    return (
      <AppLayout>
        <Container className="py-16">
          <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-600" size={40} />
            <h2 className="text-2xl font-semibold text-red-900">Unable to load analysis</h2>
            <p className="mt-3 text-red-700">{error || 'The requested analysis could not be found.'}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="secondary" onClick={() => navigate('/history')}>
                Back to History
              </Button>
              <Button onClick={() => navigate('/soil-analysis')}>
                Analyze Soil
              </Button>
            </div>
          </div>
        </Container>
      </AppLayout>
    );
  }

  const statusKey = analysis.status || 'submitted';
  const statusMeta = statusVariants[statusKey] || statusVariants.processing;
  const StatusIcon = statusMeta.icon;
  const fertilityLevel = analysis.prediction?.fertilityLevel || 'Not available';
  const confidence = analysis.prediction?.confidence !== undefined && analysis.prediction?.confidence !== null
    ? `${Math.round(Number(analysis.prediction.confidence) * 100)}%`
    : 'Not available';

  return (
    <AppLayout>
      <Container className="py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Button variant="secondary" onClick={() => navigate('/history')} className="gap-2">
            <ArrowLeft size={16} />
            Back to history
          </Button>

          <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${statusMeta.badge}`}>
            <StatusIcon size={16} />
            {statusMeta.label}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Historical Soil Analysis</p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900">{analysis.crop || 'Unknown crop'}</h1>
                <p className="mt-2 text-slate-600">{new Date(analysis.createdAt).toLocaleString()}</p>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-right">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Soil Health Score</p>
                <p className="text-3xl font-bold text-emerald-900">
                  {intelligence?.soilHealthScore ?? 'Not available'}
                  {intelligence?.soilHealthScore !== null && intelligence?.soilHealthScore !== undefined ? '/100' : ''}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-6 py-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Soil type</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{analysis.soilType || 'Not available'}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Crop</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{analysis.crop || 'Not available'}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Location</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{analysis.location || 'Not available'}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</p>
              <p className="mt-2 text-lg font-semibold text-slate-900 capitalize">{statusKey}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <BarChart3 className="text-emerald-700" size={20} />
              <h2 className="text-xl font-semibold text-slate-900">Soil parameters</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(metricConfig).map(([key, config]) => {
                const value = analysis[key];
                const metric = intelligence?.metrics?.find((item) => item.metric === key);
                const score = metric?.score ?? null;
                const label = metric?.label ?? 'Not available';

                return (
                  <div key={key} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{config.label}</p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">
                          {value !== undefined && value !== null && value !== '' ? formatNumber(value) : 'Not available'}
                          {value !== undefined && value !== null && value !== '' && config.unit ? <span className="ml-2 text-sm text-slate-500">{config.unit}</span> : null}
                        </p>
                      </div>

                      {score !== null && score !== undefined ? (
                        <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${metric?.status === 'Optimal' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : metric?.status === 'Low' ? 'border-red-200 bg-red-50 text-red-700' : metric?.status === 'High' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-slate-200 bg-slate-100 text-slate-700'}`}>
                          {label}
                        </span>
                      ) : (
                        <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">Not available</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <Leaf className="text-emerald-700" size={20} />
              <h2 className="text-xl font-semibold text-slate-900">ML prediction</h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Fertility level</p>
                <p className="mt-2 text-3xl font-bold text-emerald-900">{fertilityLevel}</p>
              </div>

              <div className="grid gap-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Prediction confidence</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{confidence}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Model name</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{analysis.prediction?.modelName || 'Not available'}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Model version</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{analysis.prediction?.modelVersion || 'Not available'}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Predicted at</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {analysis.prediction?.predictedAt ? new Date(analysis.prediction.predictedAt).toLocaleString() : 'Not available'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Risk alerts</h2>
          {intelligence?.riskAlerts?.length ? (
            <div className="mt-5 space-y-4">
              {intelligence.riskAlerts.map((alert, index) => (
                <div key={`${alert.title}-${index}`} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-amber-900">{alert.title}</h3>
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">{alert.severity}</span>
                  </div>
                  <p className="mt-2 text-sm text-amber-800">{alert.detail}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
              No material risks were identified from the available data in this record.
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Recommendations</h2>
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5 text-slate-700">
            {analysis.status === 'analyzed' && intelligence ? (
              <p>
                Recommendations for this historical record are not stored as a snapshot. Use the live recommendation pages to generate guidance from the latest analyzed soil conditions.
              </p>
            ) : (
              <p>Recommendations are not available for this historical analysis.</p>
            )}
          </div>
        </section>
      </Container>
    </AppLayout>
  );
}
