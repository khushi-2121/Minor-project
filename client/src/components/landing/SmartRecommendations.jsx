import { ArrowUpRight, Droplets, Sprout } from 'lucide-react';

const cards = [
  {
    icon: Sprout,
    title: 'Crop Recommendation',
    description: 'Discover crop options that align with the field’s identified soil conditions and cultivation potential.',
  },
  {
    icon: Droplets,
    title: 'Fertilizer Optimization',
    description: 'Understand nutrient gaps, appropriate nutrient balance, and fertilizer guidance for better yield response.',
  },
  {
    icon: ArrowUpRight,
    title: 'Soil Improvement Plan',
    description: 'Build actions focused on sustainable productivity, organic input strategy, and long-term soil health.',
  },
];

export default function SmartRecommendations() {
  return (
    <section className="bg-slate-900 py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Smart recommendations</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">More than fertility classification.</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {cards.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-3xl border border-slate-700 bg-slate-800/70 p-6 shadow-lg shadow-slate-950/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
                <Icon size={22} />
              </div>
              <h3 className="mt-5 text-2xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
