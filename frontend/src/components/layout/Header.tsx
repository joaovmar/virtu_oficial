'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span
              className={`font-display text-2xl italic ${isScrolled ? 'text-virtu-dark' : 'text-white'
                }`}
            >
              virtú
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors hover:text-virtu-gold ${isScrolled ? 'text-virtu-dark' : 'text-white'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/encontre-seu-imovel"
              className="bg-virtu-green text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-virtu-teal-light transition-colors"
            >
              encontre seu imóvel
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={isScrolled ? 'text-virtu-dark' : 'text-white'} />
            ) : (
              <Menu className={isScrolled ? 'text-virtu-dark' : 'text-white'} />
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
            className="lg:hidden bg-white"
          >
            <nav className="flex flex-col py-4 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-3 text-virtu-dark hover:text-virtu-gold transition-colors border-b border-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/encontre-seu-imovel"
                className="mt-4 bg-virtu-gold text-white px-6 py-3 rounded-full text-center font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
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
