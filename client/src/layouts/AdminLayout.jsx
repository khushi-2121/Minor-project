import { useState } from 'react';
import { BarChart3, FileText, Leaf, Menu, Settings, Sprout, Users, X, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../i18n/index.jsx';

const items = [
  { label: 'Dashboard', to: '/admin', icon: BarChart3 },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Soil Analyses', to: '/admin/soil-analyses', icon: Leaf },
  { label: 'Fertilizers', to: '/admin/fertilizers', icon: Sprout },
  { label: 'Crops', to: '/admin/crops', icon: Sprout },
  { label: 'Reports', to: '/admin/reports', icon: FileText },
  { label: 'System Analytics', to: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t } = useLanguage();
  const labels = {
    Dashboard: 'common.dashboard', Users: 'admin.users', 'Soil Analyses': 'admin.soilAnalyses', Fertilizers: 'admin.fertilizers', Crops: 'admin.crops', Reports: 'common.reports', 'System Analytics': 'admin.systemAnalytics', Settings: 'common.settings',
  };

  const logoutAdmin = () => {
    logout();
    navigate('/login');
  };

  return <div className="min-h-screen overflow-x-hidden bg-slate-50"><Navbar /><div className="flex"><aside className={`${open ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white pt-20 transition-transform md:static md:translate-x-0 md:pt-0`}><div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 md:hidden"><strong>{t('admin.panel')}</strong><button onClick={() => setOpen(false)} aria-label="Close admin menu"><X size={20} /></button></div><div className="p-4"><p className="px-3 pb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{t('admin.administration')}</p><nav className="space-y-1">{items.map(({ label: itemLabel, to, icon: Icon }) => <Link key={to} to={to} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${location.pathname === to ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'}`}><Icon size={18} />{t(labels[itemLabel] || itemLabel)}</Link>)}</nav><button onClick={logoutAdmin} className="mt-8 flex w-full items-center gap-3 rounded-xl border-t border-slate-200 px-3 py-4 text-sm font-semibold text-red-700"><LogOut size={18} />{t('common.logout')}</button></div></aside>{open && <button aria-label="Close admin menu overlay" onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-slate-900/30 md:hidden" />}<main className="min-w-0 flex-1"><div className="flex items-center border-b border-slate-200 bg-white p-4 md:hidden"><button onClick={() => setOpen(true)} aria-label="Open admin menu"><Menu size={22} /></button><span className="ml-3 font-bold text-slate-900">{t('admin.panel')}</span></div>{children}</main></div></div>;
}
