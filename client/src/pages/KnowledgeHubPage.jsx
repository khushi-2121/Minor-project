import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Container from '../components/common/Container';
import Button from '../components/common/Button';

export default function KnowledgeHubPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <Button onClick={() => navigate(-1)} variant="ghost" size="sm" className="mb-4">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-slate-900">Knowledge Hub</h1>
          <p className="mt-2 text-slate-600">Learn about soil science, sustainable farming, and best practices.</p>
        </div>
      </div>

      <Container className="py-16">
        <div className="flex max-w-2xl flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-12 text-center">
          <div className="mb-4 rounded-full bg-slate-100 p-4">
            <span className="text-2xl">📚</span>
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">Knowledge Hub Coming Soon</h2>
          <p className="mt-3 text-slate-600">Educational content about soil science, crop management, sustainable farming practices, and agricultural insights will be available soon.</p>
        </div>
      </Container>
    </div>
  );
}
