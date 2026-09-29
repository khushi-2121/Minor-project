import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Loader, Info } from 'lucide-react';
import Container from '../components/common/Container';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { recommendationService } from '../services/recommendationService';

export default function CropRecommendationPage() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        const data = await recommendationService.getCropRecommendations();
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
            className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Crop Compatibility Analysis</h1>
          <p className="mt-2 text-slate-600">
            Discover crops that are better suited to your current soil conditions.
          </p>
        </div>
        <Container className="py-16">
          <div className="flex items-center justify-center">
            <Loader size={40} className="animate-spin text-blue-600" />
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
            className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Crop Compatibility Analysis</h1>
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
            className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Crop Compatibility Analysis</h1>
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

  const { bestMatches, goodMatches, moderateMatches } = recommendations.cropRecommendations;

  return (
    <AppLayout>
      <div className="border-b border-slate-200 bg-white px-6 py-8">
        <button
          onClick={() => navigate('/recommendations')}
          className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Crop Compatibility Analysis</h1>
        <p className="mt-2 text-slate-600">
          Discover crops that are better suited to your current soil conditions.
        </p>
      </div>

      <Container className="py-12">
        {/* Soil Context */}
        <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Your Soil Conditions</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">Soil Type</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{recommendations.soilContext.soilType}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">pH</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{recommendations.soilContext.ph}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">Fertility</p>
              <Badge className="mt-1 bg-blue-100 text-blue-900">
                {recommendations.soilContext.currentCrop}
              </Badge>
            </div>
          </div>
        </div>

        {/* Best Matches */}
        {bestMatches.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">🌟 Best Matches (75+ score)</h2>
            <div className="space-y-4">
              {bestMatches.map((crop) => (
                <CropCard key={crop.id} crop={crop} />
              ))}
            </div>
          </div>
        )}

        {/* Good Matches */}
        {goodMatches.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">✓ Good Matches (60-75 score)</h2>
            <div className="space-y-4">
              {goodMatches.map((crop) => (
                <CropCard key={crop.id} crop={crop} />
              ))}
            </div>
          </div>
        )}

        {/* Moderate Matches */}
        {moderateMatches.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">◆ Moderate Matches (with amendments)</h2>
            <div className="space-y-4">
              {moderateMatches.map((crop) => (
                <CropCard key={crop.id} crop={crop} />
              ))}
            </div>
          </div>
        )}

        {/* Scoring Info */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
          <div className="flex gap-4">
            <Info className="mt-0.5 flex-shrink-0 text-blue-600" size={20} />
            <div>
              <p className="text-sm font-medium text-blue-900">Scoring Methodology</p>
              <p className="mt-2 text-sm text-blue-800">{recommendations.scoringMethodology}</p>
              <p className="mt-2 text-sm text-blue-800">{recommendations.note}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex gap-4">
          <Button onClick={() => navigate('/recommendations/fertilizer')} variant="secondary">
            View Fertilizer Recommendations
          </Button>
          <Button onClick={() => navigate('/recommendations/soil-improvement')} variant="secondary">
            View Soil Improvement Plan
          </Button>
        </div>
      </Container>
    </AppLayout>
  );
}

function CropCard({ crop }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{crop.name}</h3>
          <p className="text-sm text-slate-600">{crop.category}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">{crop.compatibilityScore}</div>
          <p className="text-xs text-slate-500">/100</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge className="bg-blue-50 text-blue-900">Season: {crop.season}</Badge>
        {crop.yieldPotential && (
          <Badge className="bg-green-50 text-green-900">Yield: {crop.yieldPotential}</Badge>
        )}
      </div>

      <p className="mt-4 text-slate-700">{crop.reason}</p>

      {/* Soil Requirements */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
          <p className="text-xs font-medium uppercase text-slate-500">Suitable Soil Types</p>
          <p className="mt-1 text-sm text-slate-900">{crop.suitableSoilTypes.join(', ')}</p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
          <p className="text-xs font-medium uppercase text-slate-500">pH Range</p>
          <p className="mt-1 text-sm text-slate-900">
            {crop.phRequirements.min} - {crop.phRequirements.max}
          </p>
        </div>
      </div>

      {/* Nutrient Requirements */}
      <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-3">
        <p className="text-xs font-medium uppercase text-slate-500">Nutrient Requirements</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          <div>
            <p className="text-xs text-slate-600">Nitrogen</p>
            <p className="text-sm font-semibold text-slate-900">
              {crop.nutrientRequirements.nitrogen.min}-{crop.nutrientRequirements.nitrogen.max} mg/kg
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600">Phosphorus</p>
            <p className="text-sm font-semibold text-slate-900">
              {crop.nutrientRequirements.phosphorus.min}-{crop.nutrientRequirements.phosphorus.max} mg/kg
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600">Potassium</p>
            <p className="text-sm font-semibold text-slate-900">
              {crop.nutrientRequirements.potassium.min}-{crop.nutrientRequirements.potassium.max} mg/kg
            </p>
          </div>
        </div>
      </div>

      {/* Advantages */}
      {crop.advantages && crop.advantages.length > 0 && (
        <div className="mt-4 rounded-lg border border-green-100 bg-green-50 p-3">
          <p className="text-xs font-medium uppercase text-green-900">Advantages</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-green-800">
            {crop.advantages.map((adv, idx) => (
              <li key={idx}>{adv}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Limitations */}
      {crop.limitations && crop.limitations.length > 0 && (
        <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3">
          <p className="text-xs font-medium uppercase text-red-900">Considerations</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-red-800">
            {crop.limitations.map((lim, idx) => (
              <li key={idx}>
                <strong>{lim.factor}:</strong> {lim.suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {crop.waterRequirement && (
        <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-3">
          <p className="text-xs font-medium uppercase text-slate-500">Water Requirement</p>
          <p className="mt-1 text-sm text-slate-900">{crop.waterRequirement}</p>
        </div>
      )}
    </div>
  );
}
