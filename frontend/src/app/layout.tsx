import type { Metadata } from 'next';
import '@/styles/globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TrackingScripts from '@/components/tracking/TrackingScripts';

export const metadata: Metadata = {
  title: 'virtú | Incorporações e Urbanismo',
  description:
    'O seu futuro é o nosso propósito. Empreendimentos de médio e alto padrão em Ribeirão Preto e região.',
  keywords: ['virtú', 'incorporadora', 'urbanismo', 'empreendimentos', 'Ribeirão Preto', 'imóveis'],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'virtú | Incorporações e Urbanismo',
    description: 'O seu futuro é o nosso propósito.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'virtú',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        {/* Fontes do Figma: Sora, Newsreader, Montserrat */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased font-sans">
        {/* Tracking: GTM, RD Station, Meta Pixel, GA4 — configurável via Wagtail */}
        <TrackingScripts />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
