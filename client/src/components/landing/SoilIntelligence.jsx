import { ArrowRight, Droplets, Leaf, ShieldCheck } from 'lucide-react';

const nutrientData = [
  { label: 'N', status: 'Normal', tone: 'emerald' },
  { label: 'P', status: 'Low', tone: 'amber' },
  { label: 'K', status: 'High', tone: 'violet' },
  { label: 'pH', status: 'Optimal', tone: 'sky' },
];

export default function SoilIntelligence() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Soil intelligence</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Understand the biology and chemistry beneath every field.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
            AgriSense AI evaluates the key soil indicators that influence crop health and fertility, including nitrogen, phosphorus, potassium, pH, moisture, organic carbon, and electrical conductivity. The platform brings those values into a clear, practical decision-making framework.
          </p>

          <div className="mt-8 space-y-4">
            {[
              { icon: Leaf, title: 'Nutrient balance', text: 'Monitor the essential nutrient profile that drives yield quality and soil productivity.' },
              { icon: Droplets, title: 'Water and structure', text: 'Track moisture and conductivity signals that influence soil performance and stress.' },
              { icon: ShieldCheck, title: 'Field confidence', text: 'Bring together soil strength, crop compatibility, and sustainability into one view.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Soil profile</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">Nutrient analysis</h3>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                UI preview
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {nutrientData.map(({ label, status, tone }) => (
                <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold ${tone === 'emerald' ? 'bg-emerald-100 text-emerald-700' : tone === 'amber' ? 'bg-amber-100 text-amber-700' : tone === 'violet' ? 'bg-violet-100 text-violet-700' : 'bg-sky-100 text-sky-700'}`}>
                      {label}
                    </div>
                    <span className="text-base font-medium text-slate-800">{status}</span>
                  </div>

                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone === 'emerald' ? 'bg-emerald-100 text-emerald-700' : tone === 'amber' ? 'bg-amber-100 text-amber-700' : tone === 'violet' ? 'bg-violet-100 text-violet-700' : 'bg-sky-100 text-sky-700'}`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-4 text-white">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Preview status</p>
                <p className="mt-2 text-lg font-semibold">Balanced soil profile</p>
              </div>
              <ArrowRight size={20} className="text-emerald-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
