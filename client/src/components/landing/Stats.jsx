import { Cpu, Leaf, Sprout, BarChart3 } from 'lucide-react';

const stats = [
  { label: 'AI-Powered Analysis', value: 'Smart', icon: Cpu },
  { label: 'Soil Insights', value: 'Real-time', icon: BarChart3 },
  { label: 'Crop Compatibility', value: 'Data-led', icon: Sprout },
  { label: 'Sustainability', value: 'Balanced', icon: Leaf },
];

export default function Stats() {
  return (
    <section className="py-10">
      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Icon size={20} />
              </div>
            </div>
            <div className="mt-5 text-2xl font-bold text-slate-900">{value}</div>
            <div className="mt-2 text-sm text-slate-600">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
