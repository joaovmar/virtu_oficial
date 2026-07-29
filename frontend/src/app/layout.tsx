import type { Metadata } from 'next';
import { Sora, Newsreader, Montserrat } from 'next/font/google';
import '@/styles/globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TrackingScripts from '@/components/tracking/TrackingScripts';

// Fontes do Figma auto-hospedadas pelo Next (sem @import externo pro Google Fonts em
// runtime) — mesmas famílias/pesos/estilos já usados no site, só muda como chegam
// ao navegador. Pesos/estilos abaixo restritos ao que é realmente usado no código.
const sora = Sora({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-sora',
  display: 'swap',
});
const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['italic'],
  variable: '--font-newsreader',
  display: 'swap',
  // O Next não tem métricas de fallback pra esse eixo específico da Newsreader
  // (fonte variável com eixo óptico) — desativa só esse ajuste auxiliar de CLS,
  // sem afetar a fonte renderizada.
  adjustFontFallback: false,
});
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'virtú | Incorporação e Urbanismo',
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
    title: 'virtú | Incorporação e Urbanismo',
    description: 'O seu futuro é o nosso propósito.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'virtú',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`scroll-smooth ${sora.variable} ${newsreader.variable} ${montserrat.variable}`}>
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
