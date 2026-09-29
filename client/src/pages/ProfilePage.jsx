import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/common/Container';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { User, Mail, MapPin, Calendar, Edit2, LogOut, Settings, BarChart3 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    region: user?.region || '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const response = await authService.getProfileSummary();
        setStatistics(response.statistics || null);
      } catch (error) {
        setApiError(error.message || 'Failed to load profile statistics');
      }
    };

    loadStatistics();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        region: user.region || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    setApiError('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.updateProfile(formData.name, formData.region);

      if (response.success) {
        updateUser(response.user);
        setIsEditMode(false);
        setSuccessMessage('Profile updated successfully.');
      } else {
        setApiError(response.message || 'Failed to update profile');
      }
    } catch (error) {
      setApiError(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      logout();
      navigate('/login');
    }
  };

  if (!user) {
    return (
      <AppLayout>
        <Container>
          <div className="text-center">
            <p className="text-slate-600">Loading profile...</p>
          </div>
        </Container>
      </AppLayout>
    );
  }

  const createdDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';

  return (
    <AppLayout>
      <main className="py-12">
        <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User size={48} />
                  )}
                </div>
                <h1 className="mt-4 text-2xl font-bold text-slate-900 text-center">{user.name}</h1>
                <Badge className="mt-3">
                  <BarChart3 size={12} />
                  {user.role === 'admin' ? 'Administrator' : 'User'}
                </Badge>
                <div className="mt-6 w-full space-y-2">
                  <Button
                    className="w-full rounded-xl py-2.5 flex items-center justify-center gap-2 !bg-emerald-700 !text-white hover:!bg-emerald-800"
                    onClick={() => setIsEditMode(!isEditMode)}
                  >
                    <Edit2 size={16} />
                    {isEditMode ? 'Cancel' : 'Edit Profile'}
                  </Button>
                  <Button
                    to="/settings"
                    variant="secondary"
                    className="w-full rounded-xl py-2.5 flex items-center justify-center gap-2"
                  >
                    <Settings size={16} />
                    Account Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                <Settings size={20} className="text-emerald-600" />
                Account Information
              </h2>

              {apiError && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-900">⚠️ {apiError}</p>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-sm font-medium text-emerald-900">{successMessage}</p>
                </div>
              )}

              <div className="space-y-5">
                {/* Name Field */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3 flex-1">
                    <User size={18} className="text-slate-400" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Full Name</p>
                      {isEditMode ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`mt-1 w-full rounded-lg border-2 px-3 py-2 font-medium text-slate-900 focus:outline-none ${
                            errors.name
                              ? 'border-red-300 focus:border-red-500'
                              : 'border-slate-200 focus:border-emerald-500'
                          }`}
                        />
                      ) : (
                        <p className="mt-1 text-base font-medium text-slate-900">{user.name}</p>
                      )}
                      {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-slate-400" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Email Address</p>
                      <p className="mt-1 text-base font-medium text-slate-900">{user.email}</p>
                    </div>
                  </div>
                  <span className="inline-block rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">Verified</span>
                </div>

                {/* Region Field */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3 flex-1">
                    <MapPin size={18} className="text-slate-400" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Region / Location</p>
                      {isEditMode ? (
                        <input
                          type="text"
                          name="region"
                          value={formData.region}
                          onChange={handleChange}
                          placeholder="e.g., Punjab, Maharashtra"
                          className="mt-1 w-full rounded-lg border-2 border-slate-200 px-3 py-2 font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                        />
                      ) : (
                        <p className="mt-1 text-base font-medium text-slate-900">{user.region || 'Not specified'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Created Date */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-slate-400" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Member Since</p>
                      <p className="mt-1 text-base font-medium text-slate-900">{createdDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {isEditMode && (
                <div className="mt-6 flex gap-3">
                  <Button
                    onClick={handleSave}
                    className="flex-1 rounded-xl py-2.5 bg-emerald-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </div>

            {/* Activity & Usage */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                <BarChart3 size={20} className="text-emerald-600" />
                Activity & Usage
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                  <div className="text-3xl font-bold text-emerald-600">{statistics?.totalSoilAnalyses ?? '—'}</div>
                  <p className="mt-2 text-sm font-medium text-slate-700">Soil Analyses</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                  <div className="text-3xl font-bold text-emerald-600">{statistics?.totalReports ?? '—'}</div>
                  <p className="mt-2 text-sm font-medium text-slate-700">Reports</p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Latest Analysis</p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {statistics?.latestAnalysisDate ? new Date(statistics.latestAnalysisDate).toLocaleDateString() : 'Not available'}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Current Soil Health</p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {statistics?.currentSoilHealthScore !== null && statistics?.currentSoilHealthScore !== undefined
                      ? `${statistics.currentSoilHealthScore}/100`
                      : 'Not available'}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                <Settings size={20} className="text-emerald-600" />
                Account Settings
              </h2>

              <div className="space-y-4">
                <Button to="/settings" variant="secondary" className="w-full rounded-xl py-3 justify-start font-medium">
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
    </AppLayout>
  );
}
