import { useState } from 'react';
import { X, Menu, LogOut, Home, Leaf, BarChart3, Lightbulb, BookOpen, Settings, TrendingUp, FileText } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import { Bot } from 'lucide-react';
import AIChat from '../components/common/AIChat';

const sidebarItems = [
  { icon: Home, label: 'Dashboard', to: '/dashboard' },
  { icon: Leaf, label: 'Soil Analysis', to: '/soil-analysis' },
  { icon: TrendingUp, label: 'History', to: '/history' },
  { icon: BarChart3, label: 'Analytics', to: '/analytics' },
  { icon: Lightbulb, label: 'Recommendations', to: '/recommendations' },
  { icon: FileText, label: 'Reports', to: '/reports' },
  { icon: BookOpen, label: 'AI Assistant', to: '/ai-assistant' },
  { icon: Settings, label: 'Knowledge Hub', to: '/knowledge' },
];

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isAssistantPage = location.pathname === '/ai-assistant';

  const isActive = (to) => location.pathname === to;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f6f8f4]">
      <Navbar />

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden w-72 border-r border-slate-200 bg-white/80 backdrop-blur-sm md:block">
          <div className="sticky top-20 p-4">
            <nav className="flex flex-col gap-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.to);

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                      active
                        ? 'bg-emerald-50 text-[#174b35] shadow-sm ring-1 ring-emerald-200'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#174b35]'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4">
              <Link
                to="/profile"
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#174b35]"
              >
                <Settings size={18} />
                <span>Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <div
          className={`fixed left-0 top-0 z-50 h-full w-72 transform bg-white transition-transform duration-300 ease-in-out md:hidden ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <span className="text-lg font-semibold text-slate-900">Menu</span>
            <button onClick={() => setSidebarOpen(false)} className="p-1">
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-1 p-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-700'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-200 p-4">
            <Link
              to="/profile"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
            >
              <Settings size={18} />
              <span>Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1">
          <div className="md:hidden flex items-center justify-between border-b border-slate-200 bg-white p-4">
            <h1 className="text-sm font-semibold text-slate-900">AgriSense AI</h1>
            <button onClick={() => setSidebarOpen(true)} className="p-1">
              <Menu size={20} />
            </button>
          </div>

          {children}
          {!isAssistantPage && (chatOpen ? <AIChat onClose={() => setChatOpen(false)} /> : <button type="button" onClick={() => setChatOpen(true)} className="fixed bottom-5 right-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700 text-white shadow-xl shadow-emerald-950/20 transition-transform hover:scale-105 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:bottom-6 sm:right-6" aria-label="Open AgriSense AI assistant" title="Open AgriSense AI assistant"><Bot size={24} aria-hidden="true" /></button>)}
        </main>
      </div>
    </div>
  );
}
