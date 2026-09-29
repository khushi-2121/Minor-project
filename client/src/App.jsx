import { BrowserRouter, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './i18n/index.jsx';

function AppShell() {
  const location = useLocation();

  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/settings',
    '/soil-analysis',
    '/soil-health',
    '/nutrient-analysis',
    '/soil-risks',
    '/history',
    '/analytics',
    '/recommendations',
    '/reports',
    '/ai-assistant',
    '/admin',
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    location.pathname === route || location.pathname.startsWith(`${route}/`)
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8faf8_0%,#ffffff_100%)] text-slate-900">
      {!isProtectedRoute && <Navbar />}
      <main>
        <AppRoutes />
      </main>
      {!isProtectedRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
