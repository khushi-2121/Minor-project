import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Filter, Search, ShieldAlert, TrendingUp } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import { soilAnalysisService } from '../services/soilAnalysisService';
import { buildSoilIntelligenceData } from '../services/soilIntelligenceService';

const formatDate = (value) => {
  if (!value) return 'Not available';
  return new Date(value).toLocaleDateString();
};

const statusStyles = {
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  analyzed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
  submitted: 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function HistoryPage() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unauthorized, setUnauthorized] = useState(false);
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('all');
  const [fertilityFilter, setFertilityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('newest');

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        setLoading(true);
        setError('');
        setUnauthorized(false);

        const response = await soilAnalysisService.getAnalyses();

        if (!response?.success || !Array.isArray(response.analyses)) {
          setError(response?.message || 'Unable to load your soil analysis history.');
          return;
        }

        setAnalyses(response.analyses);
      } catch (err) {
        if (err?.status === 401 || err?.message?.toLowerCase().includes('unauthorized')) {
          setUnauthorized(true);
          return;
        }

        setError(err?.message || 'Unable to load your soil analysis history.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  const cropOptions = useMemo(() => {
    const unique = new Set(analyses.map((analysis) => analysis.crop).filter(Boolean));
    return [...unique].sort();
  }, [analyses]);

  const filteredAnalyses = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return [...analyses]
      .filter((analysis) => {
        const matchesSearch =
          !normalized ||
          [analysis.crop, analysis.soilType, analysis.location, analysis.status, analysis.prediction?.fertilityLevel]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(normalized);

        const matchesCrop = cropFilter === 'all' || analysis.crop === cropFilter;
        const matchesFertility = fertilityFilter === 'all' || analysis.prediction?.fertilityLevel === fertilityFilter;

        return matchesSearch && matchesCrop && matchesFertility;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateFilter === 'oldest' ? dateA - dateB : dateB - dateA;
      });
  }, [analyses, search, cropFilter, fertilityFilter, dateFilter]);

  if (loading) {
    return (
      <AppLayout>
        <Container className="py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-12 w-64 rounded bg-slate-200" />
            <div className="h-20 rounded-xl bg-slate-200" />
            <div className="space-y-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-24 rounded-xl bg-slate-200" />
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
            <p className="mt-3 text-red-700">You must be logged in to view your soil analysis history.</p>
            <Button onClick={() => navigate('/login')} className="mt-6">
              Return to login
            </Button>
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
            <h2 className="text-2xl font-semibold text-red-900">Unable to load history</h2>
            <p className="mt-3 text-red-700">{error}</p>
            <Button onClick={() => navigate('/soil-analysis')} className="mt-6">
              Go to soil analysis
            </Button>
          </div>
        </Container>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="border-b border-slate-200 bg-white px-6 py-8">
        <Container>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Soil intelligence</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Analysis history</h1>
            </div>
            <Button onClick={() => navigate('/history/compare')} variant="secondary" className="gap-2">
              <TrendingUp size={16} />
              Compare analyses
            </Button>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr_0.9fr_0.8fr]">
            <label className="relative block">
              <span className="sr-only">Search history</span>
              <Search className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search by crop, soil, location or fertility"
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-slate-900 focus:border-emerald-500 focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Crop</span>
              <select value={cropFilter} onChange={(e) => setCropFilter(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none">
                <option value="all">All crops</option>
                {cropOptions.map((crop) => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Fertility</span>
              <select value={fertilityFilter} onChange={(e) => setFertilityFilter(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none">
                <option value="all">All fertility</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Sort</span>
              <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none">
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </label>
          </div>
        </div>

        {filteredAnalyses.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Filter className="text-slate-500" size={26} />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">No records found</h2>
            <p className="mt-3 text-slate-600">Try clearing your filters or run a new soil analysis to populate your history.</p>
            <Button onClick={() => navigate('/soil-analysis')} className="mt-6">
              Analyze Your Soil
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAnalyses.map((analysis) => {
              const intelligence = buildSoilIntelligenceData(analysis);
              const fertility = analysis.prediction?.fertilityLevel || 'Not available';

              return (
                <div key={analysis._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-semibold text-slate-900">{analysis.crop || 'Unknown crop'}</h2>
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[analysis.status] || statusStyles.submitted}`}>
                          {analysis.status || 'submitted'}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Date</p>
                          <p className="mt-1 font-medium text-slate-900">{formatDate(analysis.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Soil type</p>
                          <p className="mt-1 font-medium text-slate-900">{analysis.soilType || 'Not available'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Crop</p>
                          <p className="mt-1 font-medium text-slate-900">{analysis.crop || 'Not available'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fertility</p>
                          <p className="mt-1 font-medium text-slate-900">{fertility}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Soil health</p>
                          <p className="mt-1 font-medium text-slate-900">
                            {intelligence?.soilHealthScore !== undefined && intelligence?.soilHealthScore !== null ? `${intelligence.soilHealthScore}/100` : 'Not available'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row xl:flex-col 2xl:flex-row">
                      <Button onClick={() => navigate(`/history/${analysis._id}`)} variant="secondary">
                        View Analysis
                      </Button>
                      {analysis.status === 'analyzed' && (
                        <Button onClick={() => navigate(`/reports/${analysis._id}`)}>
                          View Report
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </AppLayout>
  );
}
