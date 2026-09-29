import { Leaf, Droplets, Trees, TrendingUp } from 'lucide-react';

const sustainabilityPoints = [
  'Balanced fertilizer usage',
  'Organic alternatives',
  'Water management',
  'Soil health monitoring',
];

export default function Sustainability() {
  return (
    <section className="py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
        <div className="rounded-[30px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-lime-50 p-6 shadow-sm md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Sustainability</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Field decisions with a long-term impact.</h2>
          <div className="mt-8 space-y-4">
            {sustainabilityPoints.map((point, index) => {
              const icons = [Leaf, Droplets, Trees, TrendingUp];
              const Icon = icons[index];

              return (
                <div key={point} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Icon size={18} />
                  </div>
                  <span className="text-base font-medium text-slate-700">{point}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Preview</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">Sustainability Score</h3>
              </div>
              <div className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Demo</div>
            </div>

            <div className="mt-8 flex items-end justify-between gap-4">
              <div>
                <div className="text-4xl font-black text-slate-900">82</div>
                <div className="mt-1 text-sm text-slate-500">/ 100</div>
              </div>
              <div className="mb-2 h-24 w-24 rounded-full border-[10px] border-emerald-200 border-t-emerald-600 border-r-emerald-600 border-b-emerald-600" />
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between text-sm text-slate-600">
                <span>Healthy soil trend</span>
                <span className="font-semibold text-emerald-700">+12%</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-200">
                <div className="h-2.5 w-[82%] rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
