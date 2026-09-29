import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

export default function SoilHealthOverview() {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">Soil Health Score</h2>

      <div className="mt-8 flex flex-col items-center justify-center py-8 text-center">
        <div className="mb-4 rounded-full bg-slate-100 p-4">
          <AlertCircle size={32} className="text-slate-400" />
        </div>
        <p className="text-slate-600">Complete your first soil analysis to generate your Soil Health Score.</p>
        <Button onClick={() => navigate('/soil-analysis')} className="mt-4">
          Analyze Your Soil
        </Button>
      </div>
    </div>
  );
}
