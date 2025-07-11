
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EcuTuningForm } from "@/components/EcuTuningForm";
import { EcuSolutionsSection } from "@/components/EcuSolutionsSection";

export default function EcuTuningPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <EcuSolutionsSection isPageHeader={true} />
        <section className="py-12 md:py-20">
            <div className="container">
                <EcuTuningForm />
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
