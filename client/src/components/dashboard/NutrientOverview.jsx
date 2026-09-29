import { AlertCircle } from 'lucide-react';

export default function NutrientOverview() {
  const nutrients = [
    { name: 'Nitrogen (N)', unit: 'mg/kg', status: 'Not analyzed yet' },
    { name: 'Phosphorus (P)', unit: 'mg/kg', status: 'Not analyzed yet' },
    { name: 'Potassium (K)', unit: 'mg/kg', status: 'Not analyzed yet' },
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">Nutrient Overview</h2>

      <div className="mt-4 space-y-3">
        {nutrients.map((nutrient) => (
          <div key={nutrient.name} className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
            <div>
              <p className="font-medium text-slate-900">{nutrient.name}</p>
              <p className="text-sm text-slate-600">{nutrient.unit}</p>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <AlertCircle size={16} />
              <span className="text-sm">{nutrient.status}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm text-slate-600">
        Complete a soil analysis to see detailed nutrient information and personalized recommendations.
      </p>
    </div>
  );
}
