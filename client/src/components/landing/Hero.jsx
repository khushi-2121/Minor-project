import { ArrowRight, Activity, Droplets, Leaf, Sparkles, Sprout } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

const metricItems = [
  { label: 'Soil Health Score', value: '87/100', tone: 'emerald' },
  { label: 'Nitrogen', value: '72', tone: 'sky' },
  { label: 'Phosphorus', value: '81', tone: 'amber' },
  { label: 'Potassium', value: '65', tone: 'violet' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),transparent_30%),linear-gradient(180deg,#f7faf6_0%,#ffffff_100%)] py-16 md:py-20">
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-emerald-100/60 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="animate-[fadeInUp_0.7s_ease-out]">
          <Badge className="mb-5">
            <Sparkles size={12} />
            Soil intelligence
          </Badge>

          <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            AI-powered soil intelligence for smarter farming decisions.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            AgriSense AI helps farmers and agronomists assess soil fertility, detect imbalances, and unlock actionable recommendations for better crop performance and long-term sustainability.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button to="/soil-analysis" className="rounded-full px-6 py-3.5">
              Analyze Your Soil
              <ArrowRight className="ml-2" size={18} />
            </Button>
            <Button to="/#features" variant="secondary" className="rounded-full px-6 py-3.5">
              Explore Platform
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-emerald-700" />
              AI-driven analysis
            </div>
            <div className="flex items-center gap-2">
              <Leaf size={16} className="text-emerald-700" />
              Sustainable guidance
            </div>
            <div className="flex items-center gap-2">
              <Droplets size={16} className="text-emerald-700" />
              Water-smart decisions
            </div>
          </div>
        </div>

        <div className="relative animate-[fadeInUp_0.9s_ease-out]">
          <div className="absolute -left-8 top-10 h-28 w-28 rounded-full bg-emerald-200/70 blur-3xl" />
          <div className="absolute -right-4 bottom-8 h-32 w-32 rounded-full bg-lime-200/80 blur-3xl" />

          <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Soil overview</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">Healthy Soil</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Sprout size={22} />
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {metricItems.map(({ label, value, tone }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{label}</div>
                  <div className="mt-3 text-2xl font-bold text-slate-900">{value}</div>
                  <div className={`mt-3 h-2.5 rounded-full ${tone === 'emerald' ? 'bg-emerald-100' : tone === 'sky' ? 'bg-sky-100' : tone === 'amber' ? 'bg-amber-100' : 'bg-violet-100'}`}>
                    <div
                      className={`h-2.5 rounded-full ${
                        tone === 'emerald'
                          ? 'w-[87%] bg-emerald-600'
                          : tone === 'sky'
                            ? 'w-[72%] bg-sky-600'
                            : tone === 'amber'
                              ? 'w-[81%] bg-amber-500'
                              : 'w-[65%] bg-violet-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-gradient-to-r from-emerald-700 to-green-800 p-4 text-white shadow-lg shadow-emerald-900/20">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">Preview</p>
                  <h3 className="mt-2 text-3xl font-bold">87 / 100</h3>
                </div>
                <div className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium">Soil Health Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
