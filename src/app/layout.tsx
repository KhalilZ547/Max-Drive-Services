
import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import { GlobalComponents } from '@/components/GlobalComponents';

export const metadata: Metadata = {
  title: 'Max-Drive-Services',
  description: 'Your Trusted Partner for Complete Car Care',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&family=Teko:wght@700&display=swap"
          rel="stylesheet"
        ></link>
        <meta name="theme-color" content="#0020ad" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
            <GlobalComponents />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
