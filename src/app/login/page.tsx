
"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoginForm } from "@/components/LoginForm";
import { Suspense } from "react";

function LoginPageContent() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
          <Header />
          <main className="flex-1 flex items-center justify-center p-4">
            <LoginForm />
          </main>
          <Footer />
        </div>
    )
}


export default function LoginPage() {
  return (
    <Suspense>
        <LoginPageContent />
    </Suspense>
  );
}
