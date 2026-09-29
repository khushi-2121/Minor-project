import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ClipboardList, Droplets, FlaskConical, Info, Leaf, MapPin, RefreshCcw, Sprout, Trash2 } from 'lucide-react';
import Container from '../components/common/Container';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/common/Button';
import { soilAnalysisService } from '../services/soilAnalysisService';

const soilTypeOptions = ['Sandy', 'Loamy', 'Clay', 'Silt', 'Sandy Loam', 'Clay Loam', 'Other'];

const fieldDefinitions = {
  nitrogen: {
    label: 'Nitrogen (N)',
    description: 'Supports plant growth and leaf development.',
    info: 'Nitrogen helps drive green vegetative growth. Low nitrogen can limit crop vigor, while very high levels may indicate excess fertilization or imbalance.',
  },
  phosphorus: {
    label: 'Phosphorus (P)',
    description: 'Supports root development and flowering.',
    info: 'Phosphorus contributes to root growth and energy transfer. Low levels can restrict establishment, while excessive values may affect nutrient balance.',
  },
  potassium: {
    label: 'Potassium (K)',
    description: 'Supports water regulation and stress resilience.',
    info: 'Potassium helps with water movement and stress tolerance. Low potassium may reduce resilience, while very high levels can signal excess nutrient application.',
  },
  ph: {
    label: 'pH',
    description: 'Measures soil acidity or alkalinity.',
    info: 'Soil pH affects nutrient availability and microbial activity. Very low pH can reduce uptake, while very high pH can limit availability of some nutrients.',
  },
  moisture: {
    label: 'Moisture',
    description: 'Indicates the amount of water in the soil.',
    info: 'Soil moisture affects root health and nutrient movement. Very low moisture can stress plants, while very high moisture can reduce oxygen availability.',
  },
  organicCarbon: {
    label: 'Organic Carbon',
    description: 'Indicates organic matter contribution.',
    info: 'Organic carbon is linked to soil structure and biological activity. Low values may indicate reduced fertility, while very high values may reflect excessive organic matter accumulation.',
  },
  electricalConductivity: {
    label: 'Electrical Conductivity (EC)',
    description: 'Measures dissolved salts in the soil.',
    info: 'EC helps estimate soil salinity. Low values usually indicate low salinity, while high values can suggest salt stress or poor drainage.',
  },
};

const initialForm = {
  soilType: '',
  location: '',
  crop: '',
  nitrogen: '',
  phosphorus: '',
  potassium: '',
  ph: '',
  moisture: '',
  organicCarbon: '',
  electricalConductivity: '',
};

const isNonEmpty = (value) => value !== '' && value !== null && value !== undefined;

export default function SoilAnalysisPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const liveSummary = useMemo(() => {
    return [
      ['Soil Type', formData.soilType],
      ['Crop', formData.crop],
      ['N', formData.nitrogen],
      ['P', formData.phosphorus],
      ['K', formData.potassium],
      ['pH', formData.ph],
      ['Moisture', formData.moisture],
      ['Organic Carbon', formData.organicCarbon],
      ['EC', formData.electricalConductivity],
    ].filter(([, value]) => isNonEmpty(value));
  }, [formData]);

  const requiredFields = ['soilType', 'location', 'crop', 'nitrogen', 'phosphorus', 'potassium', 'ph', 'moisture', 'organicCarbon', 'electricalConductivity'];

  const hasAnyData = Object.values(formData).some((value) => String(value).trim() !== '');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    if (apiError) {
      setApiError('');
    }

    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.soilType) nextErrors.soilType = 'Soil type is required';
    if (!formData.location || formData.location.trim().length < 2) nextErrors.location = 'Location must be at least 2 characters';
    if (!formData.crop || formData.crop.trim().length < 2) nextErrors.crop = 'Crop is required';

    const numericRules = {
      nitrogen: { min: 0, max: 500 },
      phosphorus: { min: 0, max: 500 },
      potassium: { min: 0, max: 500 },
      ph: { min: 0, max: 14 },
      moisture: { min: 0, max: 100 },
      organicCarbon: { min: 0, max: 10 },
      electricalConductivity: { min: 0, max: 10 },
    };

    Object.entries(numericRules).forEach(([field, rule]) => {
      const value = Number(formData[field]);
      if (!isNonEmpty(formData[field])) {
        nextErrors[field] = `${fieldDefinitions[field].label} is required`;
        return;
      }

      if (Number.isNaN(value)) {
        nextErrors[field] = 'Please enter a valid number';
        return;
      }

      if (value < rule.min || value > rule.max) {
        nextErrors[field] = `${fieldDefinitions[field].label} must be between ${rule.min} and ${rule.max}${field === 'ph' ? '' : field === 'moisture' || field === 'organicCarbon' ? '%' : field === 'electricalConductivity' ? ' dS/m' : ' mg/kg'}`;
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        soilType: formData.soilType,
        location: formData.location.trim(),
        crop: formData.crop.trim(),
        nitrogen: Number(formData.nitrogen),
        phosphorus: Number(formData.phosphorus),
        potassium: Number(formData.potassium),
        ph: Number(formData.ph),
        moisture: Number(formData.moisture),
        organicCarbon: Number(formData.organicCarbon),
        electricalConductivity: Number(formData.electricalConductivity),
      };

      const response = await soilAnalysisService.submitAnalysis(payload);

      if (response.success) {
        // Navigate to the result page with the analysis ID
        const analysisId = response.analysis?._id;
        if (analysisId) {
          navigate(`/soil-analysis/result/${analysisId}`);
        } else {
          setApiError('Analysis submitted but ID not returned. Please contact support.');
        }
      } else {
        setApiError(response.message || 'Unable to submit soil analysis');
      }
    } catch (error) {
      setApiError(error.message || 'Unable to submit soil analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (hasAnyData && !showConfirmReset) {
      setShowConfirmReset(true);
      return;
    }

    setFormData(initialForm);
    setErrors({});
    setApiError('');
    setSuccessMessage('');
    setShowConfirmReset(false);
  };

  const getFieldClass = (fieldName) => {
    const base = 'mt-2 w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30';
    if (errors[fieldName]) {
      return `${base} border-red-300 focus:border-red-500`;
    }
    return `${base} border-slate-200 focus:border-emerald-500`;
  };

  const isReady = requiredFields.every((field) => isNonEmpty(formData[field])) && !Object.keys(errors).length;

  return (
    <AppLayout>
      <main className="py-10 md:py-14">
        <Container>
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
              <ClipboardList size={12} />
              Step 1
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">Analyze Your Soil</h1>
            <p className="mt-3 max-w-2xl text-base text-slate-600 md:text-lg">
              Enter your soil parameters to generate an intelligent soil health assessment.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              Soil Data
            </div>
            <span className="text-slate-300">→</span>
            <div className="text-sm text-slate-400">AI Analysis</div>
            <span className="text-slate-300">→</span>
            <div className="text-sm text-slate-400">Recommendations</div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.7fr_0.8fr]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Sprout size={18} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Basic Information</h2>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Soil Type</label>
                  <select name="soilType" value={formData.soilType} onChange={handleChange} className={getFieldClass('soilType')}>
                    <option value="">Select soil type</option>
                    {soilTypeOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {errors.soilType && <p className="mt-1 text-xs text-red-600">{errors.soilType}</p>}
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Location / Region</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Hyderabad" className={getFieldClass('location')} />
                  {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Crop to be grown</label>
                  <input type="text" name="crop" value={formData.crop} onChange={handleChange} placeholder="e.g. Rice" className={getFieldClass('crop')} />
                  {errors.crop && <p className="mt-1 text-xs text-red-600">{errors.crop}</p>}
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <FlaskConical size={18} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Macronutrients</h2>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                {['nitrogen', 'phosphorus', 'potassium'].map((key) => (
                  <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <label className="text-sm font-semibold text-slate-700">{fieldDefinitions[key].label}</label>
                        <p className="mt-1 text-xs text-slate-500">{fieldDefinitions[key].description}</p>
                      </div>

                      <button type="button" className="rounded-full border border-slate-200 bg-white p-1.5 text-slate-500 hover:text-emerald-700" aria-label={`More information about ${fieldDefinitions[key].label}`} title={fieldDefinitions[key].info}>
                        <Info size={14} />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <input
                        type="number"
                        name={key}
                        value={formData[key]}
                        min={0}
                        max={500}
                        step="0.1"
                        onChange={handleChange}
                        className={getFieldClass(key)}
                        placeholder="0"
                      />
                      <span className="min-w-[62px] text-sm font-semibold text-slate-500">mg/kg</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{fieldDefinitions[key].info}</p>
                    {errors[key] && <p className="mt-2 text-xs text-red-600">{errors[key]}</p>}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                  <Droplets size={18} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Soil Properties</h2>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {['ph', 'moisture', 'organicCarbon', 'electricalConductivity'].map((key) => (
                  <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <label className="text-sm font-semibold text-slate-700">{fieldDefinitions[key].label}</label>
                        <p className="mt-1 text-xs text-slate-500">{fieldDefinitions[key].description}</p>
                      </div>
                      <button type="button" className="rounded-full border border-slate-200 bg-white p-1.5 text-slate-500 hover:text-emerald-700" aria-label={`More information about ${fieldDefinitions[key].label}`} title={fieldDefinitions[key].info}>
                        <Info size={14} />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <input
                        type="number"
                        min={key === 'ph' ? 0 : 0}
                        max={key === 'ph' ? 14 : key === 'moisture' ? 100 : key === 'organicCarbon' ? 10 : 10}
                        step="0.1"
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        className={getFieldClass(key)}
                        placeholder={key === 'ph' ? '7.0' : '0'}
                      />
                      <span className="min-w-[72px] text-sm font-semibold text-slate-500">
                        {key === 'ph' ? '' : key === 'moisture' ? '%' : key === 'organicCarbon' ? '%' : 'dS/m'}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{fieldDefinitions[key].info}</p>
                    {errors[key] && <p className="mt-2 text-xs text-red-600">{errors[key]}</p>}
                  </div>
                ))}
              </div>
            </section>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button type="submit" className="rounded-full px-6 py-3.5" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Analyze Soil'}
              </Button>

              <Button type="button" variant="secondary" className="rounded-full px-6 py-3.5" onClick={handleReset}>
                {showConfirmReset ? 'Confirm Clear Form' : 'Clear Form'}
              </Button>
            </div>

            {apiError && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p className="text-sm font-medium">{apiError}</p>
              </div>
            )}

            {successMessage && (
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                <p className="text-sm font-medium">{successMessage}</p>
              </div>
            )}
          </form>

          <aside className="xl:sticky xl:top-24 self-start">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Form Summary</p>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">Live Inputs</h3>
                </div>
                <div className={`flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ${isReady ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {isReady ? <CheckCircle2 size={14} /> : <MapPin size={14} />}
                  {isReady ? 'Ready for AI Analysis' : 'Draft'}
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {liveSummary.length === 0 ? (
                  <p className="text-sm text-slate-500">No values entered yet.</p>
                ) : (
                  liveSummary.map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                      <span className="text-sm font-medium text-slate-600">{label}</span>
                      <span className="text-sm font-semibold text-slate-900">{value}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Leaf size={16} className="text-emerald-600" />
                  Status
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {isReady ? 'All required values are valid and ready for the next AI analysis phase.' : 'Complete the required input fields before the soil analysis can be submitted.'}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </main>
    </AppLayout>
  );
}
