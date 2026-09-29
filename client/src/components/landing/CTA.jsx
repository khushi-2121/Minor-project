import Button from '../common/Button';

export default function CTA() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[32px] bg-gradient-to-r from-emerald-700 via-green-700 to-emerald-900 px-6 py-12 text-white shadow-[0_30px_90px_rgba(6,95,70,0.35)] md:px-10 lg:px-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">A smarter path for farming</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Turn Soil Data Into Smarter Farming Decisions.</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-emerald-50/90">
                Analyze your soil, understand its health, and discover data-driven recommendations for healthier crops and more sustainable fields.
              </p>
            </div>

            <Button to="/soil-analysis" className="rounded-full !bg-white px-6 py-3.5 !text-emerald-800 hover:!bg-emerald-50">
              Analyze Your Soil
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
