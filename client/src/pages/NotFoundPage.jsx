import { Compass, Home, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Container from '../components/common/Container';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  const { isAuthenticated } = useAuth();
  const destination = isAuthenticated ? '/dashboard' : '/';

  return (
    <main className="min-h-[60vh] bg-slate-50 py-20">
      <Container>
        <div className="mx-auto max-w-xl rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Compass size={32} />
          </div>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">404</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Page Not Found</h1>
          <p className="mt-3 text-slate-600">The page you requested does not exist or is no longer available.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button to={destination} className="rounded-xl">
              {isAuthenticated ? <LayoutDashboard size={17} /> : <Home size={17} />}
              {isAuthenticated ? 'Go to Dashboard' : 'Go Home'}
            </Button>
            {!isAuthenticated && <Button to="/login" variant="secondary" className="rounded-xl">Login</Button>}
          </div>
        </div>
      </Container>
    </main>
  );
}
