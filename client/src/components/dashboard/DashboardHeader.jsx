import { useAuth } from '../../hooks/useAuth';

export default function DashboardHeader() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  };

  return (
    <div className="border-b border-slate-200 bg-white px-6 py-8">
      <h1 className="text-3xl font-bold text-slate-900">
        {getGreeting()}, <span className="text-emerald-700">{user?.name || 'Farmer'}</span>
      </h1>
      <p className="mt-2 text-slate-600">Here's your latest soil intelligence overview.</p>
      <p className="mt-1 text-sm text-slate-500">{formatDate()}</p>
    </div>
  );
}
