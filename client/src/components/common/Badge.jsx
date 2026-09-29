export default function Badge({ children, className = '' }) {
  return (
    <span
      className={[
        'inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-800',
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}
