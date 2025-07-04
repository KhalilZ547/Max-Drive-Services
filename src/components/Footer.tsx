import { Wrench } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Max-Drive-Services</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Max-Drive-Services. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
