'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'home' },
  { href: '/empreendimentos', label: 'empreendimentos' },
  { href: '/a-virtu', label: 'a virtú' },
  { href: '/blog', label: 'blog' },
  { href: '/contato', label: 'fale conosco' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Uso de threshold menor (20) para rápida resposta visual e { passive: true } para performance (impede block do scroll)
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fecha o menu mobile automaticamente ao trocar de rota
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  // Páginas onde o header é TRANSPARENTE sobre hero escuro (sem fundo branco fixo)
  // Home e fale conosco: hero cobre a tela inteira, header fica sobre ele
  const isTransparentHeroPage = ['/', '/contato'].includes(pathname);
  
  // Em todas as outras páginas: header sempre sólido branco (não transparente)
  // Nas transparent pages: transparente até scroll
  const isSolid = isScrolled || !isTransparentHeroPage;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isSolid
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-2'
          // PROTECTIVE SCRIM: Gradiente sutil do topo para baixo. Garante que texto/logo branco SEMPRE apareça, mesmo se a foto do fundo for muito clara.
          : 'bg-gradient-to-b from-black/60 via-black/20 to-transparent py-3 md:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="shrink-0">
            {/* ASSET SWAPPING: Troca o arquivo nativamente ao invés de forçar filtros CSS como brightness-0 */}
            <Image
              src={isSolid ? '/virtu-logo-dark.svg' : '/virtu-logo-white.svg'}
              alt="virtú"
              width={100}
              height={40}
              priority // Prioriza o carregamento do logo (Above the fold)
              className="transition-opacity duration-300 w-[80px] md:w-[100px]"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-sans text-sm tracking-tight px-4 py-1.5 rounded-full transition-all duration-300 ${
                  isActive(link.href)
                    ? isSolid
                      ? 'text-virtu-dark border border-virtu-dark/60 bg-gray-50/50'
                      : 'text-white border border-white/60 bg-white/10 backdrop-blur-sm'
                    : isSolid
                    ? 'text-virtu-text hover:text-virtu-dark hover:bg-gray-50'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/encontre-seu-imovel"
              className="ml-2 bg-gradient-to-r from-virtu-gold to-virtu-green text-white px-5 py-2 rounded-full text-[11px] font-semibold hover:opacity-90 hover:shadow-md transition-all"
            >
              encontre seu imóvel
            </Link>
          </nav>

          {/* O stroke do SVG herda a cor do text-[color] via 'currentColor', evitando lógicas JS dentro da renderização do SVG */}
          <button
            className={`lg:hidden p-2 transition-colors duration-300 ${isSolid ? 'text-[#282828]' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="12" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="0" y1="1" x2="24" y2="1" />
                <line x1="0" y1="6" x2="24" y2="6" />
                <line x1="0" y1="11" x2="24" y2="11" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-virtu-border overflow-hidden shadow-xl"
          >
            <nav className="flex flex-col py-3 px-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-3 font-sans text-sm tracking-tight border-b border-gray-50 transition-colors ${
                    isActive(link.href) ? 'text-virtu-green font-semibold' : 'text-virtu-dark hover:text-virtu-green'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/encontre-seu-imovel"
                className="mt-4 mb-2 bg-gradient-to-r from-virtu-gold to-virtu-green text-white px-5 py-3 rounded-full text-center text-xs font-semibold shadow-sm hover:shadow-md transition-all"
              >
                encontre seu imóvel
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}