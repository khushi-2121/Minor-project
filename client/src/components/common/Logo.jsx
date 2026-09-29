const sizeClasses = {
  sm: { icon: 'h-8 w-8', text: 'text-base', gap: 'gap-2.5' },
  md: { icon: 'h-10 w-10', text: 'text-lg', gap: 'gap-3' },
  lg: { icon: 'h-12 w-12', text: 'text-xl', gap: 'gap-3.5' },
};

export default function Logo({ variant = 'full', size = 'md', className = '' }) {
  const config = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={['inline-flex items-center', config.gap, className].join(' ')}>
      <div className={['relative flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-[0_10px_30px_rgba(16,185,129,0.2)]', config.icon].join(' ')}>
        <svg viewBox="0 0 64 64" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M31.9 10.3c-8.7 7.4-14.8 15.5-14.8 24.8 0 9.6 6.5 17.1 15.2 17.1 8.7 0 15.2-7.5 15.2-17.1 0-9.1-6-17.4-15.6-24.8Z" fill="currentColor" opacity="0.18"/>
          <path d="M32 11.2c-9.1 7.7-14.2 15.5-14.2 24.2 0 8.5 6 15 14.2 15s14.2-6.5 14.2-15c0-8.4-5.1-16.5-14.2-24.2Z" fill="currentColor" opacity="0.26"/>
          <path d="M33.4 12.3c-1.1 10.9-8.6 18.8-18.2 24.1 7 4.5 13.9 6.5 21.3 6.5 8.7 0 16-2.9 21.7-9.1-7.3-1.3-14.8-8.7-24.8-21.5Z" fill="currentColor"/>
          <path d="M17.8 45.5c5.4 2.5 11.5 3.8 17.7 3.4 6.7-.4 12.3-2.1 17.3-5.2" stroke="rgba(255,255,255,0.88)" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M19.9 40.4c4.3 2 9.4 2.9 14.5 2.6 5.5-.3 10.5-1.7 15.2-4.2" stroke="rgba(255,255,255,0.7)" strokeWidth="2.2" strokeLinecap="round"/>
          <circle cx="48.8" cy="20.2" r="4.1" fill="rgba(255,255,255,0.9)"/>
          <path d="M48.8 15.6v2.1M48.8 26.4v2.1M44.3 20.2h2.1M53.8 20.2h2.1" stroke="rgba(255,255,255,0.78)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      {variant === 'full' && (
        <div className="leading-none">
          <div className={['font-extrabold tracking-[-0.04em] text-slate-900', config.text].join(' ')}>
            AgriSense <span className="text-emerald-700">AI</span>
          </div>
        </div>
      )}
    </div>
  );
}
