import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <ResetPasswordForm />
      </main>
      <Footer />
    </div>
  );
}
