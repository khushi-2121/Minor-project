import Button from '../components/common/Button';

export default function PlaceholderPage({ title, description, badge = 'Coming soon' }) {
  return (
    <main className="min-h-[70vh] bg-slate-50 py-16">
      <div className="mx-auto max-w-3xl rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
          {badge}
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">{title}</h1>
        <p className="mt-5 text-base leading-7 text-slate-600 md:text-lg">{description}</p>
        <div className="mt-8 flex justify-center">
          <Button to="/" className="rounded-full px-6 py-3.5">
            Back to Home
          </Button>
        </div>
      </div>
    </main>
  );
}
