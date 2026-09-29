import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthInput from '../components/auth/AuthInput';
import PasswordInput from '../components/auth/PasswordInput';
import PasswordStrength from '../components/auth/PasswordStrength';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { useLanguage } from '../i18n/index.jsx';

export default function SignupPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    region: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const hasLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    return hasLength && hasNumber && hasSpecial;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t('auth.nameRequired');
    }

    if (!formData.email) {
      newErrors.email = t('auth.emailRequired');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('auth.validEmail');
    }

    if (!formData.password) {
      newErrors.password = t('auth.passwordRequired');
    } else if (!validatePassword(formData.password)) {
      newErrors.password = t('auth.passwordStrength');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.confirmRequired');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.passwordMismatch');
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = t('auth.termsRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register(
        formData.fullName,
        formData.email,
        formData.password,
        formData.region
      );

      if (response.success) {
        register(response.user, response.token);
        navigate('/profile');
      } else {
        if (response.errors && response.errors.length > 0) {
          setApiError(response.errors[0].message || response.message);
        } else {
          setApiError(response.message || 'Registration failed');
        }
      }
    } catch (error) {
      if (error.errors && error.errors.length > 0) {
        setApiError(error.errors[0].message || error.message);
      } else {
        setApiError(error.message || 'An error occurred during registration');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Badge className="mb-4">
            <UserPlus size={12} />
            {t('auth.createAccount')}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-4">{t('auth.getStarted')}</h1>
          <p className="mt-2 text-slate-600">{t('auth.signupDescription')}</p>
        </div>

        {apiError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-900">⚠️ {apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            label={t('auth.fullName')}
            type="text"
            placeholder="John Farmer"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
          />

          <AuthInput
            label={t('auth.email')}
            type="email"
            placeholder="you@example.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <div>
            <PasswordInput
              label={t('auth.password')}
              placeholder="••••••••"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
            {formData.password && <PasswordStrength password={formData.password} />}
          </div>

          <PasswordInput
            label={t('auth.confirmPassword')}
            placeholder="••••••••"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />

          <AuthInput
            label={t('auth.region')}
            type="text"
            placeholder="e.g., Punjab, Maharashtra"
            name="region"
            value={formData.region}
            onChange={handleChange}
          />

          <label className="flex items-start gap-3 cursor-pointer pt-2">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 mt-0.5"
            />
            <span className={`text-sm ${errors.agreeToTerms ? 'text-red-600' : 'text-slate-700'}`}>
              {t('auth.terms')}
            </span>
          </label>

          <Button
            type="submit"
            className="w-full rounded-full py-3.5 mt-6"
            disabled={isLoading}
          >
            {isLoading ? t('auth.creatingAccount') : t('auth.createAccount')}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          {t('auth.alreadyHaveAccount')}{' '}
          <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
            {t('common.login')}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
