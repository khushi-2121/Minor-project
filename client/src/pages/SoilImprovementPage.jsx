import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Loader, Info, TrendingUp } from 'lucide-react';
import Container from '../components/common/Container';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { recommendationService } from '../services/recommendationService';

export default function SoilImprovementPage() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        const data = await recommendationService.getSoilImprovementRecommendations();
        setRecommendations(data);
      } catch (err) {
        setError(err.message || 'Failed to load recommendations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="border-b border-slate-200 bg-white px-6 py-8">
          <button
            onClick={() => navigate('/recommendations')}
            className="mb-4 flex items-center gap-2 text-amber-600 hover:text-amber-700"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Soil Improvement Plan</h1>
          <p className="mt-2 text-slate-600">
            Get actionable steps to improve your soil health and build long-term fertility.
          </p>
        </div>
        <Container className="py-16">
          <div className="flex items-center justify-center">
            <Loader size={40} className="animate-spin text-amber-600" />
          </div>
        </Container>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="border-b border-slate-200 bg-white px-6 py-8">
          <button
            onClick={() => navigate('/recommendations')}
            className="mb-4 flex items-center gap-2 text-amber-600 hover:text-amber-700"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Soil Improvement Plan</h1>
        </div>
        <Container className="py-12">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <div className="flex gap-4">
              <AlertCircle className="mt-0.5 flex-shrink-0 text-red-600" size={20} />
              <div>
                <h3 className="font-semibold text-red-900">Unable to load recommendations</h3>
                <p className="mt-1 text-sm text-red-800">{error}</p>
                <Button onClick={() => navigate('/soil-analysis')} variant="secondary" className="mt-4">
                  Complete Soil Analysis
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </AppLayout>
    );
  }

  if (!recommendations) {
    return (
      <AppLayout>
        <div className="border-b border-slate-200 bg-white px-6 py-8">
          <button
            onClick={() => navigate('/recommendations')}
            className="mb-4 flex items-center gap-2 text-amber-600 hover:text-amber-700"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Soil Improvement Plan</h1>
        </div>
        <Container className="py-12">
          <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
            <AlertCircle size={40} className="mx-auto text-slate-400" />
            <p className="mt-4 text-slate-600">No recommendations available</p>
          </div>
        </Container>
      </AppLayout>
    );
  }

  const {
    improvementPlan,
    implementation,
    soilContext,
  } = recommendations;

  return (
    <AppLayout>
      <div className="border-b border-slate-200 bg-white px-6 py-8">
        <button
          onClick={() => navigate('/recommendations')}
          className="mb-4 flex items-center gap-2 text-amber-600 hover:text-amber-700"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Soil Improvement Plan</h1>
        <p className="mt-2 text-slate-600">
          Get actionable steps to improve your soil health and build long-term fertility.
        </p>
      </div>

      <Container className="py-12">
        {/* Soil Context */}
        <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Your Soil Assessment</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">Soil Type</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{soilContext.soilType}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">Location</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{soilContext.location}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">Fertility</p>
              <Badge className="mt-1 bg-amber-100 text-amber-900">
                {soilContext.fertilityLevel}
              </Badge>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">pH</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{soilContext.ph}</p>
            </div>
          </div>
        </div>

        {/* Priority Info */}
        <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-6">
          <div className="flex gap-4">
            <TrendingUp className="mt-0.5 flex-shrink-0 text-amber-600" size={20} />
            <div>
              <p className="font-semibold text-amber-900">Implementation Priority</p>
              <p className="mt-2 text-sm text-amber-800">{recommendations.priority}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500 uppercase">Immediate (1-2 months)</p>
            <p className="mt-2 text-slate-900">{implementation.immediate}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500 uppercase">Short-term (3-6 months)</p>
            <p className="mt-2 text-slate-900">{implementation.shortTerm}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500 uppercase">Long-term (6-12 months)</p>
            <p className="mt-2 text-slate-900">{implementation.longTerm}</p>
          </div>
        </div>

        {/* Nutrient Management */}
        {improvementPlan.nutrientManagement && (
          <Section section={improvementPlan.nutrientManagement} />
        )}

        {/* pH Management */}
        {improvementPlan.phManagement && (
          <Section section={improvementPlan.phManagement} />
        )}

        {/* Organic Matter */}
        {improvementPlan.organicMatter && (
          <Section section={improvementPlan.organicMatter} />
        )}

        {/* Water Management */}
        {improvementPlan.waterManagement && (
          <Section section={improvementPlan.waterManagement} />
        )}

        {/* Sustainable Practices */}
        {improvementPlan.sustainablePractices && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              {improvementPlan.sustainablePractices.section}
            </h2>
            <p className="mb-6 text-slate-600">{improvementPlan.sustainablePractices.description}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {improvementPlan.sustainablePractices.practices.map((practice, idx) => (
                <div key={idx} className="rounded-lg border border-slate-200 bg-white p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-slate-900">{practice.name}</h3>
                    <Badge className="bg-green-50 text-green-900">{practice.impact}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{practice.benefit}</p>
                  <p className="mt-3 text-sm font-medium text-slate-900">Implementation:</p>
                  <p className="text-sm text-slate-700">{practice.implementation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
          <div className="flex gap-4">
            <Info className="mt-0.5 flex-shrink-0 text-blue-600" size={20} />
            <div>
              <p className="text-sm font-medium text-blue-900">Important Disclaimer</p>
              <p className="mt-2 text-sm text-blue-800">{recommendations.disclaimer}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex gap-4">
          <Button onClick={() => navigate('/recommendations/fertilizer')} variant="secondary">
            View Fertilizer Recommendations
          </Button>
          <Button onClick={() => navigate('/recommendations/crops')} variant="secondary">
            View Crop Compatibility
          </Button>
        </div>
      </Container>
    </AppLayout>
  );
}

function Section({ section }) {
  return (
    <div className="mb-8">
      <h2 className="mb-2 text-lg font-semibold text-slate-900">{section.section}</h2>
      <p className="mb-6 text-slate-600">{section.description}</p>

      {section.current && (
        <div className="mb-4 rounded-lg border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase text-slate-500">Current Status</p>
          <p className="mt-1 text-slate-900">{section.current}</p>
          {section.status && (
            <Badge className="mt-2 bg-slate-200 text-slate-900">{section.status}</Badge>
          )}
        </div>
      )}

      {section.recommendations && section.recommendations.length > 0 && (
        <div className="space-y-4">
          {section.recommendations.map((rec, idx) => (
            <div key={idx} className="rounded-lg border border-slate-200 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900">{rec.nutrient || rec.action}</h3>
                  <p className="mt-1 text-sm text-slate-600">{rec.issue || rec.benefit}</p>
                  {rec.status && <Badge className="mt-2 bg-slate-100 text-slate-900">{rec.status}</Badge>}
                </div>
                {rec.priority && (
                  <Badge className={getPriorityColor(rec.priority)}>{rec.priority}</Badge>
                )}
              </div>

              {rec.actions && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-900">Recommended Actions:</p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700">
                    {rec.actions.map((action, aIdx) => (
                      <li key={aIdx}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}

              {rec.timing && (
                <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <p className="text-xs font-medium uppercase text-slate-500">Timing</p>
                  <p className="mt-1 text-sm text-slate-900">{rec.timing}</p>
                </div>
              )}

              {rec.rate && (
                <div className="mt-2 rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <p className="text-xs font-medium uppercase text-slate-500">Application Rate</p>
                  <p className="mt-1 text-sm text-slate-900">{rec.rate}</p>
                </div>
              )}

              {rec.precaution && (
                <div className="mt-2 rounded-lg border border-amber-100 bg-amber-50 p-3">
                  <p className="text-xs font-medium uppercase text-amber-900">Precaution</p>
                  <p className="mt-1 text-sm text-amber-800">{rec.precaution}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getPriorityColor(priority) {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-900';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-900';
    case 'Low':
      return 'bg-green-100 text-green-900';
    default:
      return 'bg-slate-100 text-slate-900';
  }
}
