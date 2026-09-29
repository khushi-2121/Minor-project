import Logo from '../common/Logo';

export default function AuthLayout({ children, showBranding = true }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {showBranding && (
          <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-900 p-12 text-white">
            <Logo size="lg" className="text-white" />
            <p className="mt-6 max-w-md text-center text-lg leading-8 text-emerald-50">
              Intelligent Soil. Smarter Decisions.
            </p>
            <div className="mt-10 w-full max-w-sm space-y-4">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
                <p className="font-semibold">AI-powered field intelligence</p>
                <p className="mt-1 text-sm text-emerald-100">Modern soil diagnostics for precision agriculture</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
                <p className="font-semibold">Actionable insights</p>
                <p className="mt-1 text-sm text-emerald-100">Built for sustainable and data-driven farm decisions</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-12">{children}</div>
      </div>
    </main>
  );
}
