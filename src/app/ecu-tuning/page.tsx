
"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EcuTuningForm } from "@/components/EcuTuningForm";
import { EcuSolutionsSection } from "@/components/EcuSolutionsSection";
import { Suspense, useEffect } from "react";
import { useSearchParams } from 'next/navigation';

function EcuTuningContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // This effect runs when the component mounts or searchParams change.
    // If we've just navigated here with a service, scroll to the form.
    if (searchParams.has('service')) {
      setTimeout(() => {
        const element = document.getElementById('form-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // A small delay ensures the page has rendered.
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <EcuSolutionsSection isPageHeader={true} />
        <section id="form-section" className="py-12 md:py-20 scroll-mt-20">
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
    // Wrap the page in Suspense to handle the useSearchParams hook
    <Suspense fallback={<div>Loading...</div>}>
      <EcuTuningContent />
    </Suspense>
  );
}
