import { useEffect, useRef, useState } from 'react';
import { Menu, X, LogOut, User, ChevronDown } from 'lucide-react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import Button from '../common/Button';
import Logo from '../common/Logo';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../i18n/index.jsx';

const navItemsPublic = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Knowledge Hub', to: '/knowledge' },
];

const navGroupsAuthenticated = [
  { label: 'Dashboard', to: '/dashboard' },
  {
    label: 'Soil Intelligence',
    items: [
      { label: 'Soil Analysis', to: '/soil-analysis' },
      { label: 'History', to: '/history' },
      { label: 'Analytics', to: '/analytics' },
    ],
  },
  {
    label: 'Recommendations',
    items: [
      { label: 'Fertilizer', to: '/recommendations/fertilizer' },
      { label: 'Crops', to: '/recommendations/crops' },
      { label: 'Soil Improvement', to: '/recommendations/soil-improvement' },
    ],
  },
  {
    label: 'More',
    items: [
      { label: 'AI Assistant', to: '/ai-assistant' },
      { label: 'Reports', to: '/reports' },
      { label: 'Knowledge Hub', to: '/knowledge' },
      { label: 'Analytics', to: '/analytics' },
    ],
  },
  {
    label: 'Profile',
    items: [
      { label: 'Profile', to: '/profile' },
      { label: 'Account Settings', to: '/settings' },
    ],
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileGroups, setMobileGroups] = useState({});
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { language, setLanguage, languages, t } = useLanguage();

  const navLabelKeys = {
    Home: 'common.home',
    About: 'common.about',
    'Knowledge Hub': 'common.knowledgeHub',
    Dashboard: 'common.dashboard',
    'Soil Intelligence': 'common.soilIntelligence',
    'Soil Analysis': 'common.soilAnalysis',
    Recommendations: 'common.recommendations',
    Fertilizer: 'common.fertilizer',
    Crops: 'common.crops',
    'Soil Improvement': 'common.soilImprovement',
    History: 'common.history',
    Analytics: 'common.analytics',
    'AI Assistant': 'common.aiAssistant',
    Reports: 'common.reports',
    More: 'common.more',
    Profile: 'common.profile',
    'Account Settings': 'common.settings',
    Logout: 'common.logout',
    Login: 'common.login',
  };

  const label = (value) => {
    if (value === 'Account Settings') return t('settings.accountSettings');
    return t(navLabelKeys[value] || value);
  };

  const isActiveGroup = (group) => {
    if (group.to) return location.pathname === group.to || location.pathname.startsWith(`${group.to}/`);
    if (!group.items) return false;
    return group.items.some((item) => item.to && (location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  useEffect(() => {
    const onDocumentClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', onDocumentClick);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onDocumentClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const handleDropdownToggle = (label) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  const handleMobileGroupToggle = (label) => {
    setMobileGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleMenuItemClick = () => {
    setOpenDropdown(null);
    setMobileOpen(false);
  };

  const linkClass = ({ isActive }) =>
    [
      'text-sm font-medium transition-colors duration-200',
      isActive ? 'text-emerald-700' : 'text-slate-700 hover:text-emerald-700',
    ].join(' ');

  const navItems = isAuthenticated ? navGroupsAuthenticated : navItemsPublic;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-[0_1px_0_rgba(148,163,184,0.12)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center" aria-label="AgriSense AI home">
          <Logo size="sm" />
        </Link>

        <nav className="hidden items-center gap-5 lg:flex" aria-label="Main navigation" ref={dropdownRef}>
          {isAuthenticated ? (
            <>
              {navGroupsAuthenticated.map((group) => {
                if (group.to) {
                  return (
                    <NavLink
                      key={group.label}
                      to={group.to}
                      className={({ isActive }) =>
                        [
                          'text-sm font-medium transition-colors duration-200',
                          isActive ? 'text-emerald-700' : 'text-slate-700 hover:text-emerald-700',
                        ].join(' ')
                      }
                    >
                      {label(group.label)}
                    </NavLink>
                  );
                }

                return (
                  <div key={group.label} className="relative">
                    <button
                      type="button"
                      onClick={() => handleDropdownToggle(group.label)}
                      className={[
                        'flex items-center gap-1 text-sm font-medium transition-colors duration-200',
                        isActiveGroup(group) ? 'text-emerald-700' : 'text-slate-700 hover:text-emerald-700',
                      ].join(' ')}
                      aria-expanded={openDropdown === group.label}
                      aria-haspopup="menu"
                      aria-label={`${group.label} menu`}
                    >
                      <span>{label(group.label)}</span>
                      <ChevronDown size={14} className={openDropdown === group.label ? 'rotate-180 transition-transform' : 'transition-transform'} />
                    </button>

                    {openDropdown === group.label && (
                      <div className="absolute left-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_38px_rgba(15,23,42,0.12)] ring-1 ring-slate-100">
                        {group.items.map((item) =>
                          item.action === 'logout' ? (
                            <button
                              key={item.label}
                              type="button"
                              onClick={handleLogout}
                              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                            >
                              {label(item.label)}
                            </button>
                          ) : (
                            <NavLink
                              key={item.label}
                              to={item.to}
                              onClick={handleMenuItemClick}
                              className={({ isActive }) =>
                                [
                                  'flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                                  isActive ? 'bg-emerald-50 text-[#174b35]' : 'text-slate-700 hover:bg-slate-50 hover:text-[#174b35]',
                                ].join(' ')
                              }
                            >
                              {label(item.label)}
                            </NavLink>
                          )
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            navItemsPublic.map((item) => (
              <NavLink key={item.label} to={item.to} className={linkClass}>
                {label(item.label)}
              </NavLink>
            ))
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            aria-label={t('common.language')}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {languages.map((item) => <option key={item.code} value={item.code}>{item.nativeLabel}</option>)}
          </select>
          {isAuthenticated && user ? (
            <>
              <div className="text-sm">
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.role}</p>
              </div>
              <Button to="/profile" variant="secondary" className="rounded-full px-4 py-2.5">
                <User size={16} />
              </Button>
              <Button onClick={handleLogout} className="rounded-full px-4 py-2.5">
                {t('common.logout')}
              </Button>
            </>
          ) : (
            <Button to="/login" variant="secondary" className="rounded-full px-4 py-2.5">
              {t('common.login')}
            </Button>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 lg:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2 overflow-hidden px-4 py-4 sm:px-6" aria-label="Mobile navigation">
            <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
              <span>{t('common.language')}</span>
              <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label={t('common.language')} className="bg-transparent font-semibold focus:outline-none">
                {languages.map((item) => <option key={item.code} value={item.code}>{item.nativeLabel}</option>)}
              </select>
            </label>
            {isAuthenticated ? (
              <>
                {navGroupsAuthenticated.map((group) => {
                  if (group.to) {
                    return (
                      <NavLink
                        key={group.label}
                        to={group.to}
                        onClick={handleMenuItemClick}
                        className={({ isActive }) =>
                          [
                            'block rounded-xl px-3 py-2 text-sm font-medium',
                            isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-100 hover:text-emerald-700',
                          ].join(' ')
                        }
                      >
                        {label(group.label)}
                      </NavLink>
                    );
                  }

                  return (
                    <div key={group.label} className="rounded-xl border border-slate-200 bg-slate-50">
                      <button
                        type="button"
                        onClick={() => handleMobileGroupToggle(group.label)}
                        className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-medium text-slate-700"
                        aria-expanded={!!mobileGroups[group.label]}
                      >
                        <span>{label(group.label)}</span>
                        <ChevronDown size={14} className={mobileGroups[group.label] ? 'rotate-180 transition-transform' : 'transition-transform'} />
                      </button>

                      {mobileGroups[group.label] && (
                        <div className="border-t border-slate-200 px-2 py-2">
                          {group.items.map((item) =>
                            <NavLink
                              key={item.label}
                              to={item.to}
                              onClick={handleMenuItemClick}
                              className={({ isActive }) =>
                                [
                                  'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium',
                                  isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-700',
                                ].join(' ')
                              }
                            >
                              {label(item.label)}
                            </NavLink>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                <Button onClick={handleLogout} className="w-full rounded-full">
                  <LogOut size={16} />
                  {label('Logout')}
                </Button>
              </>
            ) : (
              navItemsPublic.map((item) => (
                <NavLink key={item.label} to={item.to} onClick={handleMenuItemClick} className={({ isActive }) => (isActive ? 'block rounded-xl bg-emerald-50' : 'block')}>
                  <span className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-emerald-700">
                    {label(item.label)}
                  </span>
                </NavLink>
              ))
            )}

            {!isAuthenticated && (
              <div className="mt-2 flex flex-col gap-2 border-t border-slate-200 pt-2">
                <Button to="/login" variant="secondary" className="w-full rounded-full">
                  {t('common.login')}
                </Button>
              </div>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
