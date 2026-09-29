import { useState } from 'react';
import { LockKeyhole, Bell, Languages, Palette, ShieldCheck, UserRound } from 'lucide-react';
import Container from '../components/common/Container';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/common/Button';
import { authService } from '../services/authService';
import { useLanguage } from '../i18n/index.jsx';

const initialPasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function SettingsPage() {
  const { language, setLanguage, languages, t } = useLanguage();
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: '' }));
    setMessage({ type: '', text: '' });
  };

  const validatePasswordForm = () => {
    const nextErrors = {};
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword) nextErrors.currentPassword = t('settings.currentPasswordRequired');
    if (newPassword.length < 8 || !/\d/.test(newPassword) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      nextErrors.newPassword = t('settings.newPasswordStrength');
    }
    if (newPassword !== confirmPassword) nextErrors.confirmPassword = t('auth.passwordMismatch');

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setMessage({ type: '', text: '' });

    if (!validatePasswordForm()) return;

    setIsLoading(true);
    try {
      const response = await authService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setMessage({ type: 'success', text: response.message || t('settings.passwordChanged') });
      setPasswordForm(initialPasswordForm);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || t('common.tryAgain') });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <main className="py-12">
        <Container>
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">{t('settings.account')}</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">{t('settings.title')}</h1>
            <p className="mt-2 max-w-2xl text-slate-600">{t('settings.description')}</p>
            <label className="mt-4 inline-flex items-center gap-3 text-sm font-semibold text-slate-700">{t('common.language')}<select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label={t('common.language')} className="rounded-xl border border-slate-300 bg-white px-3 py-2">{languages.map((item) => <option key={item.code} value={item.code}>{item.nativeLabel}</option>)}</select></label>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <UserRound className="text-emerald-600" size={20} />
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{t('settings.accountSettings')}</h2>
                  <p className="mt-1 text-sm text-slate-600">{t('settings.accountDescription')}</p>
                </div>
              </div>
              <Button to="/profile" variant="secondary" className="mt-6 rounded-xl">{t('settings.editProfile')}</Button>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Bell className="text-slate-400" size={20} />
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{t('settings.notificationPreferences')}</h2>
                  <p className="mt-1 text-sm text-slate-600">{t('settings.unavailableNotifications')}</p>
                </div>
              </div>
              <p className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">{t('settings.unavailableNotifications')}</p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Languages className="text-slate-400" size={20} />
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{t('settings.languagePreference')}</h2>
                  <p className="mt-1 text-sm text-slate-600">{t('settings.unavailableLanguage')}</p>
                </div>
              </div>
              <p className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">{t('settings.unavailableLanguage')}</p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Palette className="text-slate-400" size={20} />
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{t('settings.themePreference')}</h2>
                  <p className="mt-1 text-sm text-slate-600">{t('settings.unavailableTheme')}</p>
                </div>
              </div>
              <p className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">{t('settings.unavailableTheme')}</p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-emerald-600" size={20} />
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{t('settings.privacy')}</h2>
                  <p className="mt-1 text-sm text-slate-600">Your profile and analysis APIs use the authenticated account identity.</p>
                </div>
              </div>
              <p className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">No additional privacy controls are currently supported.</p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="flex items-center gap-3">
                <LockKeyhole className="text-emerald-600" size={20} />
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{t('settings.security')}</h2>
                  <p className="mt-1 text-sm text-slate-600">{t('settings.changePasswordDescription')}</p>
                </div>
              </div>

              {message.text && (
                <div className={`mt-6 rounded-xl border p-4 ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-red-200 bg-red-50 text-red-900'}`}>
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  ['currentPassword', t('settings.currentPassword')],
                  ['newPassword', t('settings.newPassword')],
                  ['confirmPassword', t('settings.confirmNewPassword')],
                ].map(([name, label]) => (
                  <label key={name} className="block">
                    <span className="text-sm font-semibold text-slate-700">{label}</span>
                    <input
                      type="password"
                      name={name}
                      value={passwordForm[name]}
                      onChange={handleChange}
                      autoComplete={name === 'currentPassword' ? 'current-password' : 'new-password'}
                      className={`mt-2 w-full rounded-xl border-2 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors[name] ? 'border-red-300' : 'border-slate-200'}`}
                    />
                    {errors[name] && <span className="mt-1 block text-xs text-red-600">{errors[name]}</span>}
                  </label>
                ))}
                <div className="md:col-span-3">
                  <Button type="submit" className="rounded-xl" disabled={isLoading}>
                    {isLoading ? t('settings.changingPassword') : t('settings.changePassword')}
                  </Button>
                </div>
              </form>
            </section>
          </div>
        </Container>
      </main>
    </AppLayout>
  );
}
