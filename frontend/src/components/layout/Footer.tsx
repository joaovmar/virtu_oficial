'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { getConfiguracoes, ConfiguracaoSite } from '@/lib/api';

// Fonte de verdade para navegação - evita recriação em cada renderização
const FOOTER_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/empreendimentos', label: 'Empreendimentos' },
  { href: '/a-virtu', label: 'A virtú' },
  { href: '/blog', label: 'Blog' },
  { href: '/contato', label: 'Fale conosco' },
];

export default function Footer() {
  const [config, setConfig] = useState<ConfiguracaoSite | null>(null);

  useEffect(() => {
    // Controller para abortar a atualização de estado se o componente for desmontado
    const controller = new AbortController();

    const fetchConfig = async () => {
      try {
        const data = await getConfiguracoes();
        // Só atualiza o estado se o componente ainda estiver na tela
        if (!controller.signal.aborted) {
          setConfig(data);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Footer: Falha ao carregar configurações do rodapé.', error);
        }
      }
    };

    fetchConfig();

    return () => {
      controller.abort(); // Cleanup seguro
    };
  }, []);

  const email = config?.email || 'contato@virtu.com.br';
  const telefone = config?.telefone || '(11) 99999-9999';
  const copyright = config?.copyright_texto || '© 2025 Todos os direitos reservados - virtú';

  return (
    <footer className="bg-virtu-bg border-t border-virtu-border pt-10 pb-6 md:pt-14 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Mobile Layout */}
        <div className="flex flex-col items-center md:hidden">
          <Link href="/" className="shrink-0 mb-6">
            {/* ASSET SWAPPING: Logo escuro direto na fonte, sem filtro de CSS */}
            <Image 
              src="/virtu-logo-dark.svg" 
              alt="virtú" 
              width={80} 
              height={32} 
              loading="lazy" 
            />
          </Link>
          
          <p className="font-sans text-[11px] tracking-tight text-virtu-light mb-2">Navegação</p>
          <nav className="flex flex-col items-center gap-1.5 mb-6">
            {FOOTER_LINKS.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="font-sans font-semibold text-[11px] tracking-tight text-virtu-muted hover:text-virtu-green transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <p className="font-sans text-[11px] tracking-tight text-virtu-light mb-2">Contato</p>
          <div className="flex flex-col items-center gap-1.5 mb-6">
            <a href={`mailto:${email}`} className="font-sans font-semibold text-[11px] tracking-tight text-virtu-muted hover:text-virtu-green transition-colors duration-300">{email}</a>
            <a href={`tel:${telefone.replace(/\D/g, '')}`} className="font-sans font-semibold text-[11px] tracking-tight text-virtu-muted hover:text-virtu-green transition-colors duration-300">{telefone}</a>
            <Link href="/contato" className="font-sans font-semibold text-[11px] tracking-tight text-virtu-muted hover:text-virtu-green transition-colors duration-300">Fale conosco</Link>
            <Link href="/politica-privacidade" className="font-sans font-semibold text-[11px] tracking-tight text-virtu-muted hover:text-virtu-green transition-colors duration-300">Política de privacidade</Link>
          </div>
          
          <p className="font-sans text-[11px] tracking-tight text-virtu-light mb-2">Acompanhe a virtú!</p>
          <div className="flex gap-5 mb-8">
            <a href={config?.facebook || '#'} target="_blank" rel="noopener noreferrer" aria-label="Facebook da virtú" className="text-virtu-muted hover:text-virtu-green transition-colors duration-300"><Facebook size={28} strokeWidth={1.2} /></a>
            <a href={config?.instagram || '#'} target="_blank" rel="noopener noreferrer" aria-label="Instagram da virtú" className="text-virtu-muted hover:text-virtu-green transition-colors duration-300"><Instagram size={28} strokeWidth={1.2} /></a>
            <a href={config?.linkedin || '#'} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn da virtú" className="text-virtu-muted hover:text-virtu-green transition-colors duration-300"><Linkedin size={28} strokeWidth={1.2} /></a>
          </div>
          
          <p className="font-copyright font-medium text-xs tracking-tight text-virtu-muted text-center">{copyright}</p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid grid-cols-4 gap-8 lg:gap-14">
          <div>
            <Link href="/">
              <Image 
                src="/virtu-logo-dark.svg" 
                alt="virtú" 
                width={140} 
                height={56} 
                loading="lazy" 
              />
            </Link>
          </div>
          
          <div>
            <h4 className="font-sans text-sm tracking-tight text-virtu-light mb-4">Navegação</h4>
            <nav className="flex flex-col gap-2.5">
              {FOOTER_LINKS.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="font-sans font-semibold text-sm tracking-tight text-virtu-muted hover:text-virtu-green transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          
          <div>
            <h4 className="font-sans text-sm tracking-tight text-virtu-light mb-4">Contato</h4>
            <div className="flex flex-col gap-2.5">
              <a href={`mailto:${email}`} className="font-sans font-semibold text-sm tracking-tight text-virtu-muted hover:text-virtu-green transition-colors duration-300">{email}</a>
              <a href={`tel:${telefone.replace(/\D/g, '')}`} className="font-sans font-semibold text-sm tracking-tight text-virtu-muted hover:text-virtu-green transition-colors duration-300">{telefone}</a>
              <Link href="/contato" className="font-sans font-semibold text-sm tracking-tight text-virtu-muted hover:text-virtu-green transition-colors duration-300">Fale conosco</Link>
              <Link href="/politica-privacidade" className="font-sans font-semibold text-sm tracking-tight text-virtu-muted hover:text-virtu-green transition-colors duration-300">Política de privacidade</Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-sans text-sm tracking-tight text-virtu-light mb-4">Acompanhe a virtú!</h4>
            <div className="flex gap-4">
              <a href={config?.facebook || '#'} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-virtu-muted hover:text-virtu-green transition-colors duration-300"><Facebook size={20} /></a>
              <a href={config?.instagram || '#'} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-virtu-muted hover:text-virtu-green transition-colors duration-300"><Instagram size={20} /></a>
              <a href={config?.linkedin || '#'} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-virtu-muted hover:text-virtu-green transition-colors duration-300"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>
        
        <div className="hidden md:block mt-10 text-center">
          <p className="font-copyright font-medium text-sm tracking-tight text-virtu-muted">{copyright}</p>
        </div>
      </div>
    </footer>
  );
}