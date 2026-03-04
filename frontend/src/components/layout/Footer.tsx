'use client';

import Link from 'next/link';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

interface FooterProps {
  config?: {
    email: string;
    telefone: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    copyright_texto: string;
  };
}

export default function Footer({ config }: FooterProps) {
  const defaultConfig = {
    email: 'contato@virtu.com.br',
    telefone: '(11) 99999-9999',
    copyright_texto: '© 2025 Todos os direitos reservados - virtú',
    ...config,
  };

  return (
    <footer className="bg-virtu-cream py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo */}
          <div>
            <Link href="/" className="font-display text-3xl italic text-virtu-dark">
              virtú
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              incorporações e urbanismo
            </p>
          </div>

          {/* Navegação */}
          <div>
            <h4 className="font-medium text-gray-400 mb-4 text-sm">Navegação</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-virtu-dark hover:text-virtu-gold transition-colors">
                Home
              </Link>
              <Link href="/empreendimentos" className="text-virtu-dark hover:text-virtu-gold transition-colors">
                Empreendimentos
              </Link>
              <Link href="/a-virtu" className="text-virtu-dark hover:text-virtu-gold transition-colors">
                A Virtú
              </Link>
              <Link href="/blog" className="text-virtu-dark hover:text-virtu-gold transition-colors">
                Blog
              </Link>
              <Link href="/contato" className="text-virtu-dark hover:text-virtu-gold transition-colors">
                Fale conosco
              </Link>
            </nav>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-medium text-gray-400 mb-4 text-sm">Contato</h4>
            <div className="flex flex-col gap-2">
              <a
                href={`mailto:${defaultConfig.email}`}
                className="text-virtu-dark hover:text-virtu-gold transition-colors"
              >
                {defaultConfig.email}
              </a>
              <a
                href={`tel:${defaultConfig.telefone.replace(/\D/g, '')}`}
                className="text-virtu-dark hover:text-virtu-gold transition-colors"
              >
                {defaultConfig.telefone}
              </a>
              <Link href="/contato" className="text-virtu-dark hover:text-virtu-gold transition-colors">
                Fale conosco
              </Link>
              <Link href="/politica-privacidade" className="text-virtu-dark hover:text-virtu-gold transition-colors">
                Política de privacidade
              </Link>
            </div>
          </div>

          {/* Redes Sociais */}
          <div>
            <h4 className="font-medium text-gray-400 mb-4 text-sm">Acompanhe a Virtú!</h4>
            <div className="flex gap-4">
              {defaultConfig.facebook && (
                <a
                  href={defaultConfig.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-virtu-dark flex items-center justify-center hover:bg-virtu-gold hover:border-virtu-gold hover:text-white transition-all"
                >
                  <Facebook size={18} />
                </a>
              )}
              {defaultConfig.instagram && (
                <a
                  href={defaultConfig.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-virtu-dark flex items-center justify-center hover:bg-virtu-gold hover:border-virtu-gold hover:text-white transition-all"
                >
                  <Instagram size={18} />
                </a>
              )}
              {defaultConfig.linkedin && (
                <a
                  href={defaultConfig.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-virtu-dark flex items-center justify-center hover:bg-virtu-gold hover:border-virtu-gold hover:text-white transition-all"
                >
                  <Linkedin size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-300 text-center">
          <p className="text-sm text-gray-500">{defaultConfig.copyright_texto}</p>
        </div>
      </div>
    </footer>
  );
}
