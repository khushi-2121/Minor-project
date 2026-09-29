export default function AuthDivider({ text = 'Or continue with' }) {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-slate-200" />
      <span className="text-xs font-medium text-slate-500 uppercase tracking-[0.1em]">{text}</span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}
