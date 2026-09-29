import { Leaf, History, Lightbulb, TrendingUp, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const actions = [
  {
    icon: Leaf,
    title: 'Analyze New Soil',
    description: 'Start a new soil fertility analysis',
    to: '/soil-analysis',
    color: 'emerald',
  },
  {
    icon: History,
    title: 'View History',
    description: 'Check your previous analyses',
    to: '/history',
    color: 'blue',
  },
  {
    icon: TrendingUp,
    title: 'View Recommendations',
    description: 'Get personalized recommendations',
    to: '/recommendations',
    color: 'amber',
  },
  {
    icon: FileText,
    title: 'View Reports',
    description: 'Open your report library',
    to: '/reports',
    color: 'slate',
  },
  {
    icon: Lightbulb,
    title: 'Ask AI Assistant',
    description: 'Get AI-powered farming insights',
    to: '/ai-assistant',
    color: 'purple',
  },
];

const colorClasses = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => {
        const Icon = action.icon;
        const colorClass = colorClasses[action.color];

        return (
          <button
            key={action.title}
            onClick={() => navigate(action.to)}
            className={`rounded-lg border p-6 text-left transition-all hover:shadow-md ${colorClass}`}
          >
            <Icon size={24} className="mb-3" />
            <h3 className="font-semibold">{action.title}</h3>
            <p className="mt-1 text-sm opacity-75">{action.description}</p>
          </button>
        );
      })}
    </div>
  );
}
