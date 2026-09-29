import Hero from '../components/landing/Hero';
import Stats from '../components/landing/Stats';
import Features from '../components/landing/Features';
import SoilIntelligence from '../components/landing/SoilIntelligence';
import HowItWorks from '../components/landing/HowItWorks';
import SmartRecommendations from '../components/landing/SmartRecommendations';
import Sustainability from '../components/landing/Sustainability';
import CTA from '../components/landing/CTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <SoilIntelligence />
      <HowItWorks />
      <SmartRecommendations />
      <Sustainability />
      <CTA />
    </>
  );
}
