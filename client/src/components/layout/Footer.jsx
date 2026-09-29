import { Link } from 'react-router-dom';
import Logo from '../common/Logo';

const navigation = [
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/about' },
  { label: 'Login', to: '/login' },
];

const legalLinks = [
  { label: 'Privacy Policy', to: '/about' },
  { label: 'Terms of Service', to: '/about' },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <Logo size="md" className="text-white" />
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
              Intelligent Soil. Smarter Decisions.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-200">Explore</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {navigation.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="transition-colors hover:text-emerald-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-200">Legal</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {legalLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="transition-colors hover:text-emerald-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-sm text-slate-400">
          © 2026 AgriSense AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
