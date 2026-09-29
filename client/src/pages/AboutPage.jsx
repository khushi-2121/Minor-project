import { Sparkles, Leaf, Zap, Droplets, Sprout, TrendingUp, Shield, Lightbulb } from 'lucide-react';
import Container from '../components/common/Container';
import SectionHeading from '../components/common/SectionHeading';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const aiCards = [
  {
    icon: Leaf,
    title: 'Understand Soil',
    description: 'Analyze soil composition and health metrics with AI-powered predictions based on real agronomic data.',
  },
  {
    icon: TrendingUp,
    title: 'Detect Imbalances',
    description: 'Identify nutrient deficiencies and excesses automatically for precise corrective action.',
  },
  {
    icon: Droplets,
    title: 'Optimize Fertilizer',
    description: 'Get personalized NPK recommendations to maximize crop yield while minimizing environmental impact.',
  },
  {
    icon: Sprout,
    title: 'Improve Decisions',
    description: 'Make data-driven crop selection and soil management decisions based on scientific analysis.',
  },
];

const capabilities = [
  { title: 'AI Soil Prediction', description: 'Machine learning predictions' },
  { title: 'Soil Health Score', description: 'Comprehensive soil quality metrics' },
  { title: 'Nutrient Analysis', description: 'NPK and micronutrient breakdown' },
  { title: 'Crop Compatibility', description: 'Smart crop recommendations' },
  { title: 'Fertilizer Recommendation', description: 'Personalized fertilizer guidance' },
  { title: 'Soil Improvement', description: 'Long-term improvement strategies' },
];

const benefits = [
  {
    icon: Lightbulb,
    title: 'Data-Driven Decisions',
    description: 'Make informed farming choices backed by scientific analysis and real data.',
  },
  {
    icon: Shield,
    title: 'Personalized Recommendations',
    description: 'Get tailored advice specific to your soil conditions and crop goals.',
  },
  {
    icon: TrendingUp,
    title: 'Soil Health Tracking',
    description: 'Monitor and improve soil fertility over time with actionable insights.',
  },
  {
    icon: Zap,
    title: 'Sustainable Farming',
    description: 'Reduce chemical waste and optimize resources for environmental responsibility.',
  },
];

const technologies = [
  { name: 'React', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend Runtime' },
  { name: 'Express', category: 'Backend Framework' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'Python', category: 'ML Service' },
  { name: 'FastAPI', category: 'ML Framework' },
  { name: 'Scikit-learn', category: 'ML Library' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-emerald-100/40 to-transparent" />
        <Container className="relative">
          <div className="max-w-3xl mx-auto text-center animate-[fadeInUp_0.7s_ease-out]">
            <Badge className="mb-4">
              <Sparkles size={12} />
              About us
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
              Making Soil Intelligence Accessible
            </h1>
            <p className="mt-6 text-lg md:text-xl leading-8 text-slate-600 max-w-2xl mx-auto">
              AgriSense AI combines soil analysis, machine learning, nutrient intelligence, and smart agricultural
              recommendations to help farmers make better decisions. We believe soil intelligence should be accessible,
              affordable, and actionable for every farmer.
            </p>
          </div>
        </Container>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-slate-50 to-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading
                eyebrow="Our mission"
                title="Help farmers grow better through soil intelligence"
                description="We're on a mission to help agricultural stakeholders make better soil and fertilizer decisions using data-driven insights. By combining real machine learning with agronomic expertise, we empower farmers to optimize fertility, reduce waste, and improve crop outcomes."
              />
              <div className="mt-8 space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-1 bg-emerald-600 rounded-full" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Scientific Approach</h3>
                    <p className="text-sm text-slate-600 mt-1">Real ML models trained on agronomic data, not guesswork.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-1 bg-emerald-600 rounded-full" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Farmer-Centric Design</h3>
                    <p className="text-sm text-slate-600 mt-1">Built with farmers' real challenges and needs in mind.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-1 bg-emerald-600 rounded-full" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Sustainability First</h3>
                    <p className="text-sm text-slate-600 mt-1">Promote sustainable farming practices and soil conservation.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-8 top-20 h-40 w-40 bg-emerald-200/30 rounded-full blur-3xl" />
              <div className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center border border-emerald-200">
                  <div className="text-center">
                    <Leaf className="h-16 w-16 text-emerald-700 mx-auto mb-4" />
                    <p className="text-sm font-semibold text-emerald-900">Soil Health Dashboard</p>
                    <p className="text-xs text-emerald-700 mt-2">Coming to AgriSense AI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* How AI Helps Agriculture */}
      <section className="py-16 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="AI for smarter agriculture"
            description="AgriSense AI uses machine learning to transform soil data into actionable intelligence."
            centered
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow animate-[fadeInUp_0.7s_ease-out]"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900">{card.title}</h3>
                  <p className="mt-2 text-slate-600">{card.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Platform Capabilities */}
      <section className="py-16 md:py-24 bg-slate-50">
        <Container>
          <SectionHeading
            eyebrow="Platform capabilities"
            title="Everything you need for soil intelligence"
            centered
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((capability, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center hover:border-emerald-200 hover:bg-emerald-50/50 transition-all"
              >
                <h3 className="font-semibold text-slate-900">{capability.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{capability.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Why AgriSense AI */}
      <section className="py-16 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Why choose AgriSense AI"
            title="Benefits built for real farmers"
            centered
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-8 hover:border-emerald-200 hover:shadow-lg transition-all"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-700">
                    <Icon size={28} />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900">{benefit.title}</h3>
                  <p className="mt-2 text-slate-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Technology Stack */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
        <Container>
          <SectionHeading
            eyebrow="Technology"
            title="Built with modern, proven technologies"
            description="AgriSense AI is built on a robust, scalable architecture using industry-standard tools and frameworks."
            centered
          />
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {technologies.map((tech, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white p-4 text-center hover:border-emerald-200 hover:bg-emerald-50/30 transition-all"
              >
                <div className="font-semibold text-slate-900">{tech.name}</div>
                <div className="mt-1 text-xs text-slate-500 uppercase tracking-[0.1em]">{tech.category}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 rounded-2xl border border-slate-200 bg-white text-center">
            <p className="text-sm text-slate-600">
              We make no unsupported claims about accuracy. Our predictions are based on real machine learning models
              trained on agronomic data, with transparent methodology and conservative confidence reporting.
            </p>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>
        <Container className="relative">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Start Understanding Your Soil</h2>
            <p className="mt-4 text-lg text-emerald-100">
              Turn your soil data into meaningful insights with AgriSense AI. Analyze your soil health, understand nutrient conditions, and get intelligent recommendations for better agricultural decisions.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button to="/soil-analysis" className="rounded-full px-8 py-3.5 !bg-white !text-emerald-700 hover:!bg-emerald-50">
                Analyze Your Soil
              </Button>
              <Button to="/" variant="ghost" className="rounded-full px-8 py-3.5 border border-white text-white hover:bg-white/10">
                Back to Home
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
