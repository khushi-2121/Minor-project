import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, BarChart3, GitCompareArrows, TrendingDown, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import AppLayout from '../layouts/AppLayout';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import { soilAnalysisService } from '../services/soilAnalysisService';
import { buildSoilIntelligenceData } from '../services/soilIntelligenceService';

const metricFields = [
  { key: 'nitrogen', label: 'Nitrogen', unit: 'mg/kg' },
  { key: 'phosphorus', label: 'Phosphorus', unit: 'mg/kg' },
  { key: 'potassium', label: 'Potassium', unit: 'mg/kg' },
  { key: 'ph', label: 'pH', unit: '' },
  { key: 'moisture', label: 'Moisture', unit: '%' },
  { key: 'organicCarbon', label: 'Organic Carbon', unit: '%' },
  { key: 'electricalConductivity', label: 'Electrical Conductivity', unit: 'dS/m' },
];

const formatValue = (value, unit) => {
  if (value === null || value === undefined || value === '') return 'Not available';
  return `${Number(value).toFixed(value % 1 !== 0 ? 2 : 0)}${unit ? ` ${unit}` : ''}`;
};

const getDelta = (before, after) => {
  if (before === null || before === undefined || before === '' || after === null || after === undefined || after === '') return 'Not available';
  const delta = Number(after) - Number(before);
  return `${delta >= 0 ? '+' : ''}${delta.toFixed(2)}`;
};

const getTrendTone = (diff) => {
  if (diff === 'Not available') return 'text-slate-600';
  return Number(diff) >= 0 ? 'text-emerald-700' : 'text-red-700';
};

export default function HistoryComparePage() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [selectedA, setSelectedA] = useState('');
  const [selectedB, setSelectedB] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await soilAnalysisService.getAnalyses();

        if (!response?.success || !Array.isArray(response.analyses)) {
          setError(response?.message || 'Could not load analysis history.');
          return;
        }

        const sorted = [...response.analyses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAnalyses(sorted);

        if (sorted.length >= 2) {
          setSelectedA(sorted[0]._id);
          setSelectedB(sorted[1]._id);
        }
      } catch (err) {
        setError(err?.message || 'Could not load analysis history.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const firstAnalysis = analyses.find((item) => item._id === selectedA) || analyses[0] || null;
  const secondAnalysis = analyses.find((item) => item._id === selectedB) || analyses[1] || null;

  const comparisonData = useMemo(() => {
    if (!firstAnalysis || !secondAnalysis) return [];

    return metricFields.map((field) => {
      const before = firstAnalysis[field.key];
      const after = secondAnalysis[field.key];
      const diff = Number(after ?? 0) - Number(before ?? 0);
      return {
        name: field.label,
        previous: Number(before ?? 0),
        current: Number(after ?? 0),
        diff,
      };
    });
  }, [firstAnalysis, secondAnalysis]);

  const scoreA = buildSoilIntelligenceData(firstAnalysis)?.soilHealthScore;
  const scoreB = buildSoilIntelligenceData(secondAnalysis)?.soilHealthScore;
  const scoreDelta = scoreA !== undefined && scoreB !== undefined ? Number(scoreB) - Number(scoreA) : null;

  if (loading) {
    return (
      <AppLayout>
        <Container className="py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-52 rounded bg-slate-200" />
            <div className="h-20 rounded-xl bg-slate-200" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="h-64 rounded-xl bg-slate-200" />
              <div className="h-64 rounded-xl bg-slate-200" />
            </div>
          </div>
        </Container>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <Container className="py-16">
          <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-600" size={40} />
            <h2 className="text-2xl font-semibold text-red-900">Comparison unavailable</h2>
            <p className="mt-3 text-red-700">{error}</p>
            <Button onClick={() => navigate('/history')} className="mt-6">
              Go back to history
            </Button>
          </div>
        </Container>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Container className="py-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Button variant="secondary" onClick={() => navigate('/history')} className="gap-2">
            <ArrowLeft size={16} />
            History
          </Button>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <GitCompareArrows className="text-emerald-700" size={22} />
            <h1 className="text-3xl font-bold text-slate-900">Compare soil analyses</h1>
          </div>
          <p className="mt-2 text-slate-600">Select two records to compare nutrient trends, fertility and soil health.</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Select older analysis</span>
              <select value={selectedA} onChange={(e) => setSelectedA(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none">
                <option value="">Choose an analysis</option>
                {analyses.map((analysis) => (
                  <option key={analysis._id} value={analysis._id}>
                    {new Date(analysis.createdAt).toLocaleDateString()} - {analysis.crop}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Select recent analysis</span>
              <select value={selectedB} onChange={(e) => setSelectedB(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none">
                <option value="">Choose an analysis</option>
                {analyses.map((analysis) => (
                  <option key={analysis._id} value={analysis._id}>
                    {new Date(analysis.createdAt).toLocaleDateString()} - {analysis.crop}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {!firstAnalysis || !secondAnalysis ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
            Choose two analyses to compare their trend and changes.
          </div>
        ) : (
          <>
            <div className="mb-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Older analysis</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">{new Date(firstAnalysis.createdAt).toLocaleDateString()}</h3>
                <p className="mt-1 text-slate-600">{firstAnalysis.crop} · {firstAnalysis.soilType}</p>
                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Soil Health Score</p>
                  <p className="text-3xl font-bold text-slate-900">{scoreA ?? 'Not available'}{scoreA !== null && scoreA !== undefined ? '/100' : ''}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recent analysis</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">{new Date(secondAnalysis.createdAt).toLocaleDateString()}</h3>
                <p className="mt-1 text-slate-600">{secondAnalysis.crop} · {secondAnalysis.soilType}</p>
                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Soil Health Score</p>
                  <p className="text-3xl font-bold text-slate-900">{scoreB ?? 'Not available'}{scoreB !== null && scoreB !== undefined ? '/100' : ''}</p>
                </div>
              </div>
            </div>

            <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <BarChart3 className="text-emerald-700" size={20} />
                <h2 className="text-xl font-semibold text-slate-900">Score change</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Soil health delta</p>
                  <p className={`mt-2 text-2xl font-bold ${scoreDelta === null ? 'text-slate-700' : scoreDelta >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {scoreDelta === null ? 'Not available' : `${scoreDelta >= 0 ? '+' : ''}${scoreDelta}`}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Fertility change</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {firstAnalysis.prediction?.fertilityLevel || 'Not available'} → {secondAnalysis.prediction?.fertilityLevel || 'Not available'}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Trend</p>
                  <p className={`mt-2 flex items-center gap-2 text-2xl font-bold ${scoreDelta !== null && scoreDelta >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {scoreDelta !== null && scoreDelta >= 0 ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
                    {scoreDelta === null ? 'Not available' : scoreDelta >= 0 ? 'Improvement' : 'Decline'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <BarChart3 className="text-emerald-700" size={20} />
                <h2 className="text-xl font-semibold text-slate-900">Metric comparison</h2>
              </div>

              <div className="h-[420px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 10, bottom: 90 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-15} textAnchor="end" height={90} interval={0} />
                    <YAxis />
                    <Tooltip formatter={(value) => formatValue(value, '')} />
                    <Legend />
                    <Bar dataKey="previous" name={new Date(firstAnalysis.createdAt).toLocaleDateString()} fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="current" name={new Date(secondAnalysis.createdAt).toLocaleDateString()} fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                <h2 className="text-xl font-semibold text-slate-900">Detailed differences</h2>
              </div>

              <div className="divide-y divide-slate-200">
                {metricFields.map((field) => {
                  const oldValue = firstAnalysis[field.key];
                  const newValue = secondAnalysis[field.key];
                  const delta = getDelta(oldValue, newValue);
                  const tone = getTrendTone(delta);

                  return (
                    <div key={field.key} className="grid gap-4 px-6 py-4 md:grid-cols-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Metric</p>
                        <p className="mt-1 text-base font-semibold text-slate-900">{field.label}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Older</p>
                        <p className="mt-1 text-base text-slate-900">{formatValue(oldValue, field.unit)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Current</p>
                        <p className="mt-1 text-base text-slate-900">{formatValue(newValue, field.unit)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Difference</p>
                        <p className={`mt-1 text-base font-semibold ${tone}`}>{delta}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </Container>
    </AppLayout>
  );
}
