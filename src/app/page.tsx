import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { DonationSection } from "@/components/DonationSection";
import { ImageCarousel } from "@/components/ImageCarousel";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ImageCarousel />
        <ServicesSection />
        <TestimonialsSection />
        <DonationSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
