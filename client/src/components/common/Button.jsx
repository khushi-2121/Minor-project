import { Link } from 'react-router-dom';

export default function Button({ children, to, href, variant = 'primary', className = '', type = 'button', ...props }) {
  const sharedClasses = [
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:ring-offset-2',
    'min-h-[46px] px-5 py-2.5 text-sm md:text-base',
    className,
  ].join(' ');

  const variants = {
    primary: 'bg-[#1d5a3d] text-white shadow-[0_10px_25px_rgba(29,90,61,0.18)] hover:bg-[#174b35]',
    secondary: 'border border-slate-200 bg-white text-slate-800 hover:border-emerald-200 hover:bg-emerald-50 hover:text-[#1d5a3d]',
    dark: 'bg-slate-900 text-white hover:bg-slate-800',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  };

  const classes = `${sharedClasses} ${variants[variant] || variants.primary}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
