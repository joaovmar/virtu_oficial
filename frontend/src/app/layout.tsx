import type { Metadata } from 'next';
import '@/styles/globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Virtú | Incorporações e Urbanismo',
  description:
    'O seu futuro é o nosso propósito. Empreendimentos de médio e alto padrão em Ribeirão Preto e região.',
  keywords: ['Virtú', 'incorporadora', 'urbanismo', 'empreendimentos', 'Ribeirão Preto', 'imóveis'],
  openGraph: {
    title: 'Virtú | Incorporações e Urbanismo',
    description: 'O seu futuro é o nosso propósito.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Virtú',
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
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
