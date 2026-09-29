import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import Button from '../common/Button';
import { soilAnalysisService } from '../../services/soilAnalysisService';

export default function LatestAnalysis() {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLatestAnalysis = async () => {
      try {
        setLoading(true);
        const response = await soilAnalysisService.getAnalyses();

        if (response.success && response.analyses?.length > 0) {
          setAnalysis(response.analyses[0]);
        }
      } catch (err) {
        setError('Unable to load latest analysis');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Latest Soil Analysis</h2>
        <div className="mt-4 space-y-3">
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-3/4 rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Latest Soil Analysis</h2>

        <div className="mt-8 flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-4 rounded-full bg-slate-100 p-4">
            <AlertCircle size={32} className="text-slate-400" />
          </div>
          <p className="text-slate-600">No soil analysis yet.</p>
          <Button onClick={() => navigate('/soil-analysis')} className="mt-4">
            Analyze Your Soil
          </Button>
        </div>
      </div>
    );
  }

  const statusIcon = {
    processing: Clock,
    analyzed: CheckCircle,
    failed: AlertCircle,
  }[analysis.status] || AlertCircle;

  const StatusIcon = statusIcon;
  const statusColor = {
    processing: 'text-blue-600',
    analyzed: 'text-green-600',
    failed: 'text-red-600',
  }[analysis.status] || 'text-slate-600';

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Latest Soil Analysis</h2>
          <p className="mt-1 text-sm text-slate-600">{new Date(analysis.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusIcon size={20} className={statusColor} />
          <span className="text-sm font-medium capitalize text-slate-600">{analysis.status}</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase text-slate-600">Soil Type</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{analysis.soilType}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase text-slate-600">Crop</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{analysis.crop}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase text-slate-600">Fertility</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{analysis.prediction?.fertilityLevel || 'Analyzing...'}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase text-slate-600">Nitrogen</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{analysis.nitrogen} mg/kg</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase text-slate-600">Phosphorus</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{analysis.phosphorus} mg/kg</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase text-slate-600">Potassium</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{analysis.potassium} mg/kg</p>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <Button onClick={() => navigate(`/soil-analysis/result/${analysis._id}`)} variant="outline">
          View Report
        </Button>
        <Button onClick={() => navigate('/history')} variant="secondary">
          View All History
        </Button>
      </div>
    </div>
  );
}
