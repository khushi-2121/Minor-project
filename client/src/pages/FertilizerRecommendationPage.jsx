import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Loader, CheckCircle2, Info } from 'lucide-react';
import Container from '../components/common/Container';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { recommendationService } from '../services/recommendationService';

export default function FertilizerRecommendationPage() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        const data = await recommendationService.getFertilizerRecommendations();
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
            className="mb-4 flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Smart Fertilizer Recommendation</h1>
          <p className="mt-2 text-slate-600">
            Get fertilizer guidance based on your soil condition and selected crop.
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

  if (error) {
    return (
      <AppLayout>
        <div className="border-b border-slate-200 bg-white px-6 py-8">
          <button
            onClick={() => navigate('/recommendations')}
            className="mb-4 flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Smart Fertilizer Recommendation</h1>
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
            className="mb-4 flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Smart Fertilizer Recommendation</h1>
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

  return (
    <AppLayout>
      <div className="border-b border-slate-200 bg-white px-6 py-8">
        <button
          onClick={() => navigate('/recommendations')}
          className="mb-4 flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Smart Fertilizer Recommendation</h1>
        <p className="mt-2 text-slate-600">
          Get fertilizer guidance based on your soil condition and selected crop.
        </p>
      </div>

      <Container className="py-12">
        {/* Soil Context Card */}
        <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Your Soil Context</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">Soil Type</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{recommendations.soilContext.soilType}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">Crop</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{recommendations.soilContext.crop}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">Fertility Level</p>
              <Badge className="mt-1 bg-emerald-100 text-emerald-900">
                {recommendations.soilContext.fertilityLevel}
              </Badge>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">pH</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{recommendations.soilContext.ph}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-3 lg:grid-cols-7">
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">N</p>
              <p className="mt-1 font-semibold text-slate-900">{recommendations.soilContext.nitrogen} mg/kg</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">P</p>
              <p className="mt-1 font-semibold text-slate-900">{recommendations.soilContext.phosphorus} mg/kg</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">K</p>
              <p className="mt-1 font-semibold text-slate-900">{recommendations.soilContext.potassium} mg/kg</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">Moisture</p>
              <p className="mt-1 font-semibold text-slate-900">{recommendations.soilContext.moisture}%</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">OC</p>
              <p className="mt-1 font-semibold text-slate-900">{recommendations.soilContext.organicCarbon}%</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">EC</p>
              <p className="mt-1 font-semibold text-slate-900">{recommendations.soilContext.electricalConductivity} dS/m</p>
            </div>
          </div>
        </div>

        {/* Nutrient Analysis */}
        <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Nutrient Analysis</h2>

          {/* Deficiencies */}
          {recommendations.nutrientAnalysis.deficiencies.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle size={20} />
                <h3 className="font-semibold">Deficiencies Identified</h3>
              </div>
              <div className="mt-3 space-y-3">
                {recommendations.nutrientAnalysis.deficiencies.map((def, idx) => (
                  <div key={idx} className="rounded-lg border border-red-100 bg-red-50 p-4">
                    <p className="font-semibold text-red-900">{def.nutrient}</p>
                    <p className="text-sm text-red-800">{def.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nitrogen Status */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Nitrogen</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {recommendations.nutrientAnalysis.nitrogen.value}
              </p>
              <p className="mt-1 text-xs text-slate-600">mg/kg</p>
              <Badge className="mt-2 bg-slate-200 text-slate-900">{recommendations.nutrientAnalysis.nitrogen.status}</Badge>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Phosphorus</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {recommendations.nutrientAnalysis.phosphorus.value}
              </p>
              <p className="mt-1 text-xs text-slate-600">mg/kg</p>
              <Badge className="mt-2 bg-slate-200 text-slate-900">
                {recommendations.nutrientAnalysis.phosphorus.status}
              </Badge>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Potassium</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {recommendations.nutrientAnalysis.potassium.value}
              </p>
              <p className="mt-1 text-xs text-slate-600">mg/kg</p>
              <Badge className="mt-2 bg-slate-200 text-slate-900">
                {recommendations.nutrientAnalysis.potassium.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Recommended Fertilizers */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900">Recommended Fertilizers</h2>
          <p className="mt-2 text-sm text-slate-600">
            Based on your soil analysis, here are the fertilizers we recommend:
          </p>

          <div className="mt-6 space-y-4">
            {recommendations.recommendations.map((rec, idx) => (
              <div key={idx} className="rounded-lg border border-slate-200 bg-white p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-slate-900">{rec.fertilizer}</h3>
                      <Badge className={getPriorityColor(rec.priority)}>{rec.priority} Priority</Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{rec.category}</p>
                    <p className="mt-2 text-slate-700">{rec.reason}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <Badge className="bg-slate-100 text-slate-900">{rec.type}</Badge>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-900">Nutrient Composition</p>
                  <p className="mt-1 text-sm text-slate-700">{rec.composition}</p>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-900">Application Guidance</p>
                  <p className="mt-1 text-sm text-slate-700">{rec.applicationGuidance}</p>
                </div>

                {rec.organicAlternative && (
                  <div className="mt-4 rounded-lg border border-green-100 bg-green-50 p-4">
                    <p className="text-sm font-medium text-green-900">🌱 Organic Alternative</p>
                    <p className="mt-1 text-sm text-green-800">{rec.organicAlternative}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

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
          <Button onClick={() => navigate('/recommendations/crops')} variant="secondary">
            View Crop Recommendations
          </Button>
          <Button onClick={() => navigate('/recommendations/soil-improvement')} variant="secondary">
            View Soil Improvement Plan
          </Button>
        </div>
      </Container>
    </AppLayout>
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
