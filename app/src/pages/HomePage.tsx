import { useScrollReveal } from "../hooks/useScrollReveal";
import HeroSection from "./sections/HeroSection";
import ImpactSection from "./sections/ImpactSection";
import DivisionsSection from "./sections/DivisionsSection";
import IndustriesSection from "./sections/IndustriesSection";
import ConsultingServicesSection from "./sections/ConsultingServicesSection";
import ComplyCloudSection from "./sections/ComplyCloudSection";
import AcademySection from "./sections/AcademySection";
import PestControlSection from "./sections/PestControlSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import BlogPreviewSection from "./sections/BlogPreviewSection";
import CTASection from "./sections/CTASection";

export default function HomePage() {
  useScrollReveal();

  return (
    <main>
      <HeroSection />
      <ImpactSection />
      <DivisionsSection />
      <IndustriesSection />
      <ConsultingServicesSection />
      <ComplyCloudSection />
      <AcademySection />
      <PestControlSection />
      <TestimonialsSection />
      <BlogPreviewSection />
      <CTASection />
    </main>
  );
}
