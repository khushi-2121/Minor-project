const steps = [
  { id: '01', title: 'Enter Soil Data', text: 'Record field indicators such as nutrient values, pH, moisture, and crop context.' },
  { id: '02', title: 'AI Analyzes Soil', text: 'The platform reviews data patterns and soil conditions using a structured intelligent workflow.' },
  { id: '03', title: 'Get Smart Recommendations', text: 'Receive fertilizer plans, crop guidance, and actionable improvement suggestions.' },
  { id: '04', title: 'Track Soil Health', text: 'Monitor improvements over time and measure the impact of agronomic decisions.' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">How it works</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">From soil data to smarter decisions</h2>
        </div>

        <div className="relative mt-12 grid gap-6 lg:grid-cols-4">
          <div className="hidden lg:absolute left-[12.5%] right-[12.5%] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-200" />

          {steps.map(({ id, title, text }) => (
            <div key={id} className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-bold text-emerald-700">
                {id}
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
