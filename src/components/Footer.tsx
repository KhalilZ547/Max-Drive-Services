import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container py-8">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex items-center gap-2">
            <Logo className="h-10 w-10 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Max-Drive-Services. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
