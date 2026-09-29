import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthInput from '../components/auth/AuthInput';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (emailValue) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(emailValue);
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setSubmitted(true);
    console.log('Reset link would be sent to:', email);

    // Reset after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 5000);
  };

  if (submitted) {
    return (
      <AuthLayout showBranding={false}>
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <Mail size={40} className="text-emerald-600" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-slate-900">Check your email</h1>
          <p className="mt-4 text-slate-600">
            If an account exists for <span className="font-semibold">{email}</span>, we would send password reset instructions.
          </p>
          <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-900">
              ℹ️ Email functionality in development. Ready for future backend integration.
            </p>
          </div>
          <Link to="/login" className="mt-6 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout showBranding={false}>
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Badge className="mb-4">
            <Mail size={12} />
            Password recovery
          </Badge>
          <h1 className="text-3xl font-bold text-slate-900 mt-4">Forgot your password?</h1>
          <p className="mt-2 text-slate-600">
            No problem. Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthInput
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={handleChange}
            error={error}
            required
          />

          <Button type="submit" className="w-full rounded-full py-3.5">
            Send Reset Link
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Remember your password?{' '}
          <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
            Sign in instead
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
