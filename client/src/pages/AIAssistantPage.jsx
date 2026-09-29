import { Bot } from 'lucide-react';
import Container from '../components/common/Container';
import AppLayout from '../layouts/AppLayout';
import AIChat from '../components/common/AIChat';

export default function AIAssistantPage() {
  return (
    <AppLayout>
      <div className="border-b border-slate-200 bg-white px-6 py-8">
        <h1 className="text-3xl font-bold text-slate-900">AI Assistant</h1>
        <p className="mt-2 text-slate-600">
          Ask questions about your soil, nutrients, crops, fertilizers, and improvement plans.
        </p>
      </div>

      <Container className="py-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Bot size={22} aria-hidden="true" /></div>
          <div><h2 className="text-xl font-bold text-slate-900">AgriSense AI Assistant</h2><p className="text-sm text-slate-600">Personalized context is used when a completed soil analysis is available.</p></div>
        </div>
        <AIChat inline />
      </Container>
    </AppLayout>
  );
}
