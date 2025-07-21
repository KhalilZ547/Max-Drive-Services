
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { EcuSolutionsSection } from "@/components/EcuSolutionsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { DonationSection } from "@/components/DonationSection";
import { ImageCarousel } from "@/components/ImageCarousel";
import { getAllSettings } from "@/services/settings";

export default async function Home() {
  const settings = await getAllSettings();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection settings={settings} />
        <ImageCarousel settings={settings} />
        <ServicesSection />
        <EcuSolutionsSection />
        <TestimonialsSection />
        <DonationSection />
        <ContactSection settings={settings} />
      </main>
      <Footer settings={settings} />
    </div>
  );
}
