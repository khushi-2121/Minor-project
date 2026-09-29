import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, AlertCircle, Leaf, Sprout, Droplets, Loader } from 'lucide-react';
import Container from '../components/common/Container';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/common/Button';
import { recommendationService } from '../services/recommendationService';

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const [hasAnalysis, setHasAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAnalysis = async () => {
      try {
        // Try to fetch recommendations to check if analysis exists
        await recommendationService.getRecommendations();
        setHasAnalysis(true);
      } catch (error) {
        setHasAnalysis(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAnalysis();
  }, []);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="border-b border-slate-200 bg-white px-6 py-8">
          <h1 className="text-3xl font-bold text-slate-900">Smart Recommendations</h1>
          <p className="mt-2 text-slate-600">
            Turn your soil data into practical, data-driven agricultural decisions.
          </p>
        </div>

        <Container className="py-16">
          <div className="flex items-center justify-center">
            <Loader size={40} className="animate-spin text-emerald-600" />
          </div>
        </Container>
      </AppLayout>
    );
  }

  if (!hasAnalysis) {
    return (
      <AppLayout>
        <div className="border-b border-slate-200 bg-white px-6 py-8">
          <h1 className="text-3xl font-bold text-slate-900">Smart Recommendations</h1>
          <p className="mt-2 text-slate-600">
            Turn your soil data into practical, data-driven agricultural decisions.
          </p>
        </div>

        <Container className="py-16">
          <div className="flex max-w-2xl flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-12 text-center">
            <div className="mb-4 rounded-full bg-slate-100 p-4">
              <AlertCircle size={40} className="text-slate-400" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Complete your first soil analysis
            </h2>
            <p className="mt-3 text-slate-600">
              To receive personalized recommendations for fertilizers, crops, and soil improvement,
              you'll need to complete a soil analysis first.
            </p>
            <Button onClick={() => navigate('/soil-analysis')} className="mt-6">
              <span>Analyze Your Soil</span>
              <ArrowRight size={16} />
            </Button>
          </div>
        </Container>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="border-b border-slate-200 bg-white px-6 py-8">
        <h1 className="text-3xl font-bold text-slate-900">Smart Recommendations</h1>
        <p className="mt-2 text-slate-600">
          Turn your soil data into practical, data-driven agricultural decisions.
        </p>
      </div>

      <Container className="py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Fertilizer Recommendations */}
          <button
            onClick={() => navigate('/recommendations/fertilizer')}
            className="group rounded-xl border border-slate-200 bg-white p-6 text-left transition-all duration-200 hover:border-emerald-200 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 group-hover:bg-emerald-100">
              <Droplets className="text-emerald-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Fertilizer Recommendation</h3>
            <p className="mt-2 text-sm text-slate-600">
              Get targeted fertilizer suggestions based on your soil nutrient analysis.
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-emerald-600">
              <span className="text-sm font-medium">Explore</span>
              <ArrowRight size={16} />
            </div>
          </button>

          {/* Crop Compatibility */}
          <button
            onClick={() => navigate('/recommendations/crops')}
            className="group rounded-xl border border-slate-200 bg-white p-6 text-left transition-all duration-200 hover:border-blue-200 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 group-hover:bg-blue-100">
              <Leaf className="text-blue-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Crop Compatibility</h3>
            <p className="mt-2 text-sm text-slate-600">
              Discover which crops are best suited to your current soil conditions.
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-blue-600">
              <span className="text-sm font-medium">Explore</span>
              <ArrowRight size={16} />
            </div>
          </button>

          {/* Soil Improvement */}
          <button
            onClick={() => navigate('/recommendations/soil-improvement')}
            className="group rounded-xl border border-slate-200 bg-white p-6 text-left transition-all duration-200 hover:border-amber-200 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 group-hover:bg-amber-100">
              <Sprout className="text-amber-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Soil Improvement Plan</h3>
            <p className="mt-2 text-sm text-slate-600">
              Get actionable steps to improve your soil health and build long-term fertility.
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-amber-600">
              <span className="text-sm font-medium">Explore</span>
              <ArrowRight size={16} />
            </div>
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-12 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <p className="text-sm text-blue-900">
            <strong>💡 Pro Tip:</strong> All recommendations are personalized based on your latest soil
            analysis. For best results, conduct regular soil tests (annually or bi-annually) to monitor
            changes and adjust recommendations accordingly.
          </p>
        </div>
      </Container>
    </AppLayout>
  );
}
