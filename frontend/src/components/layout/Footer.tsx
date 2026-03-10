'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { getConfiguracoes, ConfiguracaoSite } from '@/lib/api';

/**
 * Footer / Rodapé - Figma: "rodapé" (node 1:120)
 * Background: #fbfbfb, border: #eee
 * Headings: Sora Regular 22px, cor: #c0c0c0, tracking: -0.22px
 * Links: Sora SemiBold 22px, cor: #858585, tracking: -0.22px
 * Copyright: Montserrat Medium 22px, cor: #858585, tracking: -0.22px
 * Logo: logo-fundo branco PNG
 */

export default function Footer() {
  const [config, setConfig] = useState<ConfiguracaoSite | null>(null);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const data = await getConfiguracoes();
        setConfig(data);
      } catch {
        // Use defaults silently
      }
    }
    fetchConfig();
  }, []);

  const email = config?.email || 'contato@virtu.com.br';
  const telefone = config?.telefone || '(11) 99999-9999';
  const copyright = config?.copyright_texto || '© 2025 Todos os direitos reservados - virtú';

  return (
    <footer
      className="bg-virtu-bg border-t border-virtu-border"
      style={{ paddingTop: '80px', paddingBottom: '50px' }}
    >
      <div className="max-w-[1720px] mx-auto px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-20">
          {/* Logo */}
          <div>
            <Link href="/">
              <Image
                src="/virtu-logo-white.svg"
                alt="Virtú"
                width={196}
                height={76}
                className="brightness-0"
              />
            </Link>
          </div>

          {/* Navegação - Figma: heading #c0c0c0, links #858585 */}
          <div>
            <h4 className="font-sans font-normal text-[22px] tracking-[-0.22px] text-virtu-light mb-5">
              Navegação
            </h4>
            <nav className="flex flex-col gap-3.5">
              {[
                { href: '/', label: 'Home' },
                { href: '/empreendimentos', label: 'Empreendimentos' },
                { href: '/a-virtu', label: 'A Virtú' },
                { href: '/blog', label: 'Blog' },
                { href: '/contato', label: 'Fale conosco' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans font-semibold text-[22px] tracking-[-0.22px] text-virtu-muted hover:text-virtu-green transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-sans font-normal text-[22px] tracking-[-0.22px] text-virtu-light mb-5">
              Contato
            </h4>
            <div className="flex flex-col gap-3.5">
              <a
                href={`mailto:${email}`}
                className="font-sans font-semibold text-[22px] tracking-[-0.22px] text-virtu-muted hover:text-virtu-green transition-colors"
              >
                {email}
              </a>
              <a
                href={`tel:${telefone.replace(/\D/g, '')}`}
                className="font-sans font-semibold text-[22px] tracking-[-0.22px] text-virtu-muted hover:text-virtu-green transition-colors"
              >
                {telefone}
              </a>
              <Link
                href="/contato"
                className="font-sans font-semibold text-[22px] tracking-[-0.22px] text-virtu-muted hover:text-virtu-green transition-colors"
              >
                Fale conosco
              </Link>
              <Link
                href="/politica-privacidade"
                className="font-sans font-semibold text-[22px] tracking-[-0.22px] text-virtu-muted hover:text-virtu-green transition-colors"
              >
                Política de privacidade
              </Link>
            </div>
          </div>

          {/* Redes Sociais */}
          <div>
            <h4 className="font-sans font-normal text-[22px] tracking-[-0.22px] text-virtu-light mb-5">
              Acompanhe a Virtú!
            </h4>
            <div className="flex gap-5">
              <a
                href={config?.facebook || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-virtu-muted hover:text-virtu-green transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href={config?.instagram || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-virtu-muted hover:text-virtu-green transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href={config?.linkedin || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-virtu-muted hover:text-virtu-green transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright - Figma: Montserrat Medium 22px #858585 */}
        <div className="mt-16 text-center">
          <p className="font-copyright font-medium text-[22px] tracking-[-0.22px] text-virtu-muted">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
