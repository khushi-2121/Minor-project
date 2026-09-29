import { useNavigate } from 'react-router-dom';
import { ArrowRight, AlertCircle } from 'lucide-react';
import Container from '../components/common/Container';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/common/Button';

export default function AnalyticsPage() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="border-b border-slate-200 bg-white px-6 py-8">
        <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
        <p className="mt-2 text-slate-600">Visualize trends and insights from your soil analyses.</p>
      </div>

      <Container className="py-16">
        <div className="flex max-w-2xl flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-12 text-center">
          <div className="mb-4 rounded-full bg-slate-100 p-4">
            <AlertCircle size={40} className="text-slate-400" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">Analytics coming soon</h2>
          <p className="mt-3 text-slate-600">Analytics will be available after you complete multiple soil analyses. This will show trends and patterns in your soil health.</p>
          <Button onClick={() => navigate('/soil-analysis')} className="mt-6">
            <span>Start Your First Analysis</span>
            <ArrowRight size={16} />
          </Button>
        </div>
      </Container>
    </AppLayout>
  );
}
