
"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EcuTuningForm } from "@/components/EcuTuningForm";
import { EcuSolutionsSection } from "@/components/EcuSolutionsSection";
import { Suspense, useEffect } from "react";

function EcuTuningContent() {
  useEffect(() => {
    if (window.location.hash === '#form-section') {
      setTimeout(() => {
        const element = document.getElementById('form-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); 
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <EcuSolutionsSection isPageHeader={true} />
        <section id="form-section" className="py-12 md:py-20">
            <div className="container">
                <EcuTuningForm />
            </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default function EcuTuningPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EcuTuningContent />
    </Suspense>
  );
}
