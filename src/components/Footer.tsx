
import { Logo } from "./Logo";
import { Instagram, Facebook } from 'lucide-react';
import { WhatsappIcon } from './WhatsappIcon';
import React from "react";

const FooterComponent = () => {
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#";
  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL || "#";
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL || "#";

  return (
    <footer className="bg-card border-t">
      <div className="container py-8">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-2">
            <Logo className="h-10 w-10 text-primary" />
          </div>
          <div className="flex items-center gap-4">
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-6 w-6" />
            </a>
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="h-6 w-6" />
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-muted-foreground hover:text-primary transition-colors">
              <WhatsappIcon className="h-6 w-6" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Max-Drive-Services. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export const Footer = React.memo(FooterComponent);
