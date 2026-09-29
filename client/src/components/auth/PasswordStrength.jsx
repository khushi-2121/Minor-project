export default function PasswordStrength({ password }) {
  const checks = {
    length: password.length >= 8,
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;
  const strength =
    passedChecks === 0 ? 'weak' : passedChecks === 1 ? 'fair' : passedChecks === 2 ? 'good' : 'strong';

  const strengthColors = {
    weak: 'bg-red-500',
    fair: 'bg-amber-500',
    good: 'bg-blue-500',
    strong: 'bg-emerald-500',
  };

  const strengthLabels = {
    weak: 'Weak',
    fair: 'Fair',
    good: 'Good',
    strong: 'Strong',
  };

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${strengthColors[strength]} transition-all duration-300 ${
              strength === 'weak' ? 'w-1/4' : strength === 'fair' ? 'w-1/2' : strength === 'good' ? 'w-3/4' : 'w-full'
            }`}
          />
        </div>
        <span className={`text-xs font-semibold ${
          strength === 'weak' ? 'text-red-600' : strength === 'fair' ? 'text-amber-600' : strength === 'good' ? 'text-blue-600' : 'text-emerald-600'
        }`}>
          {strengthLabels[strength]}
        </span>
      </div>
      
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${checks.length ? 'bg-emerald-100' : 'bg-slate-100'}`}>
            {checks.length && <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
          </div>
          <span className={`text-xs ${checks.length ? 'text-slate-700' : 'text-slate-500'}`}>At least 8 characters</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${checks.number ? 'bg-emerald-100' : 'bg-slate-100'}`}>
            {checks.number && <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
          </div>
          <span className={`text-xs ${checks.number ? 'text-slate-700' : 'text-slate-500'}`}>At least one number</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${checks.special ? 'bg-emerald-100' : 'bg-slate-100'}`}>
            {checks.special && <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
          </div>
          <span className={`text-xs ${checks.special ? 'text-slate-700' : 'text-slate-500'}`}>Special character (!@#$%^&*)</span>
        </div>
      </div>
    </div>
  );
}
