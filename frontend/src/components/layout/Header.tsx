'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

/**
 * Navbar - Figma: "navbar- home" (node 1:119)
 * Font: Sora Regular 17.15px, cor links: #414141
 * Link ativo: border #282828 rounded-[20.921px]
 * Botão CTA: gradient from-[#c1a784] to-[#348981] rounded-[20.921px]
 * Logo: logo-fundo branco (imagem PNG do Figma)
 */

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
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-[1431px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo - Figma: logo-fundo branco */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/virtu-logo-white.svg"
              alt="Virtú"
              width={123}
              height={48}
              className={`transition-all duration-300 ${
                isScrolled ? 'brightness-0' : 'brightness-100'
              }`}
            />
          </Link>

          {/* Desktop Navigation - Figma: Sora Regular 17.15px */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-sans text-[17px] tracking-[-0.17px] px-5 py-2 rounded-[20.921px] transition-all duration-300 ${
                  isActive(link.href)
                    ? isScrolled
                      ? 'text-virtu-dark border border-virtu-dark/80'
                      : 'text-white border border-white/80'
                    : isScrolled
                    ? 'text-virtu-text hover:text-virtu-dark'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Botão CTA - Figma: gradient from-[#c1a784] to-[#348981], Sora SemiBold 10.63px */}
            <Link
              href="/encontre-seu-imovel"
              className="ml-3 bg-gradient-cta-reverse text-white px-6 py-2.5 rounded-[20.921px] text-[10.6px] font-semibold tracking-[-0.1px] hover:opacity-90 transition-opacity"
            >
              encontre seu imóvel
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isMobileMenuOpen ? (
              <X className={isScrolled ? 'text-virtu-dark' : 'text-white'} size={24} />
            ) : (
              <Menu className={isScrolled ? 'text-virtu-dark' : 'text-white'} size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-virtu-border"
          >
            <nav className="flex flex-col py-4 px-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-3.5 font-sans text-[15px] tracking-[-0.15px] transition-colors border-b border-gray-50 ${
                    isActive(link.href)
                      ? 'text-virtu-green font-semibold'
                      : 'text-virtu-dark hover:text-virtu-green'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/encontre-seu-imovel"
                className="mt-5 bg-gradient-cta-reverse text-white px-6 py-3 rounded-[20.921px] text-center text-[13px] font-semibold"
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
