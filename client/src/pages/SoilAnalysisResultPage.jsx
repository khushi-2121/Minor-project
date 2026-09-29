import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, CheckCircle, Clock, Database, Leaf, Lock, Zap } from 'lucide-react';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import SectionHeading from '../components/common/SectionHeading';
import { soilAnalysisService } from '../services/soilAnalysisService';

const StatusBadge = ({ status }) => {
  const variants = {
    processing: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: Clock,
      label: 'Processing',
    },
    analyzed: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      icon: CheckCircle,
      label: 'Analyzed',
    },
    failed: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: AlertCircle,
      label: 'Failed',
    },
  };

  const variant = variants[status] || variants.processing;
  const Icon = variant.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${variant.bg} ${variant.border} ${variant.text}`}>
      <Icon size={16} />
      <span className="text-sm font-medium">{variant.label}</span>
    </div>
  );
};

const FertilityResultCard = ({ fertilityLevel, confidence }) => {
  const variants = {
    Low: {
      bg: 'bg-orange-50',
      border: 'border-orange-300',
      text: 'text-orange-900',
      icon: AlertCircle,
      color: 'text-orange-500',
    },
    Medium: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      text: 'text-yellow-900',
      icon: Zap,
      color: 'text-yellow-500',
    },
    High: {
      bg: 'bg-green-50',
      border: 'border-green-300',
      text: 'text-green-900',
      icon: Leaf,
      color: 'text-green-500',
    },
  };

  const variant = variants[fertilityLevel] || variants.Medium;
  const Icon = variant.icon;

  return (
    <div className={`rounded-lg border-2 ${variant.border} ${variant.bg} p-8 text-center`}>
      <p className={`text-sm font-semibold ${variant.text} mb-4 uppercase tracking-wide`}>Soil Fertility</p>
      <div className="flex justify-center mb-6">
        <Icon size={56} className={variant.color} />
      </div>
      <h2 className={`text-5xl font-bold ${variant.text} mb-4`}>{fertilityLevel}</h2>
      {confidence !== null && confidence !== undefined ? (
        <p className={`text-lg ${variant.text}`}>
          <span className="font-semibold">{Math.round(confidence * 100)}%</span> Prediction Confidence
        </p>
      ) : (
        <p className={`text-sm ${variant.text}`}>Confidence information is not available for this model.</p>
      )}
    </div>
  );
};

const SoilParameterCard = ({ label, value, unit }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">{label}</p>
    <p className="text-2xl font-bold text-gray-900">
      {value}
      <span className="text-sm text-gray-500 ml-2">{unit}</span>
    </p>
  </div>
);

const LoadingSkeletons = () => (
  <Container className="py-8">
    <div className="space-y-6">
      <div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
      <div className="h-40 bg-gray-200 rounded-lg animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  </Container>
);

export default function SoilAnalysisResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await soilAnalysisService.getAnalysisById(id);

        if (!response.success || !response.analysis) {
          setError('Unable to load soil analysis. Please try again.');
          return;
        }

        setAnalysis(response.analysis);
      } catch (err) {
        setError(err.message || 'Unable to load soil analysis');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  if (loading) {
    return <LoadingSkeletons />;
  }

  if (error) {
    return (
      <Container className="py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex gap-4">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Unable to Load Analysis</h3>
                <p className="text-red-800 text-sm mb-4">{error}</p>
                <Button onClick={() => navigate('/soil-analysis')} variant="outline" size="sm">
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Soil Analysis
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (!analysis) {
    return (
      <Container className="py-16">
        <div className="max-w-2xl mx-auto text-center">
          <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600 mb-6">Analysis not found</p>
          <Button onClick={() => navigate('/soil-analysis')}>Back to Soil Analysis</Button>
        </div>
      </Container>
    );
  }

  const { prediction, status, nitrogen, phosphorus, potassium, ph, moisture, organicCarbon, electricalConductivity, soilType, location, crop, createdAt } = analysis;

  const isProcessing = status === 'processing';
  const isAnalyzed = status === 'analyzed' && prediction?.fertilityLevel;
  const isFailed = status === 'failed';

  return (
    <Container className="py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" onClick={() => navigate('/soil-analysis')} className="mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Back to Soil Analysis
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <SectionHeading>Your Soil Analysis</SectionHeading>
              <p className="text-gray-600 text-sm mt-2">{new Date(createdAt).toLocaleDateString()} at {new Date(createdAt).toLocaleTimeString()}</p>
            </div>
            <StatusBadge status={status} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 rounded-lg p-6">
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Soil Type</p>
              <p className="text-lg font-semibold text-gray-900">{soilType}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Crop</p>
              <p className="text-lg font-semibold text-gray-900">{crop}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Location</p>
              <p className="text-lg font-semibold text-gray-900">{location}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase mb-1">ID</p>
              <p className="text-sm font-mono text-gray-600 truncate">{analysis._id}</p>
            </div>
          </div>
        </div>

        {/* Processing State */}
        {isProcessing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center mb-8">
            <Clock className="mx-auto mb-4 text-blue-600 animate-spin" size={40} />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Analysis In Progress</h3>
            <p className="text-blue-800">Your soil data is being analyzed by the AI model. This may take a few moments...</p>
          </div>
        )}

        {/* Failed State */}
        {isFailed && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center mb-8">
            <AlertCircle className="mx-auto mb-4 text-red-600" size={40} />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Analysis Failed</h3>
            <p className="text-red-800 mb-6">Unable to complete the analysis. This may be due to ML service unavailability or temporary issues.</p>
            <Button onClick={() => navigate('/soil-analysis')} className="inline-block">
              Try Again
            </Button>
          </div>
        )}

        {/* Success State - Fertility Result */}
        {isAnalyzed && (
          <>
            <div className="mb-8">
              <FertilityResultCard fertilityLevel={prediction.fertilityLevel} confidence={prediction.confidence} />
            </div>

            {/* Soil Parameters Grid */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Soil Parameters Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SoilParameterCard label="Nitrogen" value={nitrogen} unit="mg/kg" />
                <SoilParameterCard label="Phosphorus" value={phosphorus} unit="mg/kg" />
                <SoilParameterCard label="Potassium" value={potassium} unit="mg/kg" />
                <SoilParameterCard label="pH" value={ph} unit="" />
                <SoilParameterCard label="Moisture" value={moisture} unit="%" />
                <SoilParameterCard label="Organic Carbon" value={organicCarbon} unit="%" />
                <SoilParameterCard label="Electrical Conductivity" value={electricalConductivity} unit="dS/m" />
                <SoilParameterCard label="Soil Type" value={soilType} unit="" />
              </div>
            </div>

            {/* Model Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Information</h3>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Model</p>
                    <p className="text-base font-medium text-gray-900">{prediction.modelName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Version</p>
                    <p className="text-base font-medium text-gray-900">{prediction.modelVersion}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Prediction Date</p>
                    <p className="text-base font-medium text-gray-900">{new Date(prediction.predictedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => navigate('/soil-analysis')} variant="secondary">
                <ArrowLeft size={16} className="mr-2" />
                New Analysis
              </Button>
              <Button onClick={() => navigate('/history')} variant="secondary">
                <Database size={16} className="mr-2" />
                View History
              </Button>
              {prediction?.fertilityLevel && (
                <Button onClick={() => navigate(`/reports/${analysis._id}`)}>
                  Generate Report
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Data Privacy Notice */}
      <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-gray-200">
        <div className="flex gap-3 text-xs text-gray-600">
          <Lock size={16} className="flex-shrink-0 mt-0.5" />
          <p>Your soil analysis data is private and encrypted. Only you can view your analyses and predictions.</p>
        </div>
      </div>
    </Container>
  );
}
