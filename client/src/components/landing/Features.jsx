import { BrainCircuit, Gauge, Sprout, SunMedium, LeafyGreen, ShieldAlert } from 'lucide-react';

const features = [
  {
    icon: BrainCircuit,
    title: 'AI Soil Prediction',
    description: 'Analyze soil indicators through a modern AI workflow designed to highlight fertility and agronomic readiness.',
  },
  {
    icon: Gauge,
    title: 'Soil Health Score',
    description: 'Understand the overall condition of the field with a clear score that summarizes key nutrient and environmental factors.',
  },
  {
    icon: Sprout,
    title: 'Nutrient Deficiency Detection',
    description: 'Identify nutrient gaps and excesses before they reduce yield quality or consistency.',
  },
  {
    icon: SunMedium,
    title: 'Smart Fertilizer Recommendation',
    description: 'Receive practical guidance around fertilizer selection, nutrient balance, and application strategy.',
  },
  {
    icon: LeafyGreen,
    title: 'Crop Compatibility',
    description: 'Match soil strength, crop needs, and field conditions to reveal suitable crop possibilities.',
  },
  {
    icon: ShieldAlert,
    title: 'Soil Risk Alerts',
    description: 'Surface early warnings around soil stress patterns, imbalance risk, and sustainability concerns.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Core features</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Everything You Need to Understand Your Soil</h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                <Icon size={22} />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-slate-900">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
