'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getEmpreendimentosDestaques, EmpreendimentoCard } from '@/lib/api';

/**
 * Futuros Lançamentos - Figma:
 * Título: Sora Light 50px #282828 "Futuros" + Newsreader Medium Italic 75px #348981 "lançamentos"
 * Banner: 1920x785 com imagem bg, setas de navegação, dots/bolinhas
 * Texto sobre banner: Sora Regular/SemiBold, branco
 */

export default function FuturosLancamentosSection() {
  const [empreendimentos, setEmpreendimentos] = useState<EmpreendimentoCard[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getEmpreendimentosDestaques();
        setEmpreendimentos(data);
      } catch {
        // silently use fallback
      }
    }
    fetchData();
  }, []);

  const hasData = empreendimentos.length > 0;
  const activeEmp = hasData ? empreendimentos[activeIndex] : null;

  return (
    <section className="py-16 md:py-24 bg-white">
      {/* Título - Figma: centralizado */}
      <div className="text-center mb-12 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-sans font-light text-[36px] md:text-[50px] text-virtu-dark leading-none">
            Futuros
          </p>
          <p className="font-display font-medium italic text-[50px] md:text-[75px] text-virtu-green leading-[0.9]">
            lançamentos
          </p>
        </motion.div>
      </div>

      {/* Banner - Figma: 1920x785, full-width */}
      <div className="relative w-full h-[400px] md:h-[600px] lg:h-[785px] overflow-hidden group">
        <Image
          src={activeEmp?.imagem_principal?.url || '/ribeirao-preto-bg.jpg'}
          alt={activeEmp?.title || 'Futuro lançamento'}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Conteúdo sobre o banner */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-7xl mx-auto">
            {activeEmp?.cidade && (
              <h3 className="text-white font-sans font-semibold text-[32px] md:text-[50px] tracking-[-0.5px] mb-3">
                {activeEmp.cidade.nome} | {activeEmp.cidade.estado}
              </h3>
            )}
            <p className="text-white/90 font-sans font-light text-[16px] md:text-[20px] tracking-[-0.2px] max-w-2xl leading-relaxed">
              {activeEmp?.descricao_curta ||
                'Ribeirão Preto, cidade que pulsa crescimento e qualidade de vida, em breve receberá novos lançamentos da virtú, pensados para acompanhar o ritmo e o potencial da região.'}
            </p>
          </div>
        </div>

        {/* Setas - Figma: weui:arrow-outlined */}
        <button
          onClick={() => setActiveIndex(prev => prev > 0 ? prev - 1 : (empreendimentos.length || 1) - 1)}
          className="absolute left-[3%] top-1/2 -translate-y-1/2 w-[35px] h-[70px] flex items-center justify-center text-white/50 hover:text-white transition-colors"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-8 h-8" strokeWidth={1.5} />
        </button>
        <button
          onClick={() => setActiveIndex(prev => prev < (empreendimentos.length || 1) - 1 ? prev + 1 : 0)}
          className="absolute right-[3%] top-1/2 -translate-y-1/2 w-[35px] h-[70px] flex items-center justify-center text-white/50 hover:text-white transition-colors"
          aria-label="Próximo"
        >
          <ChevronRight className="w-8 h-8" strokeWidth={1.5} />
        </button>

        {/* Dots / Bolinhas - Figma: node bolinhas */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          {(empreendimentos.length > 0 ? empreendimentos : [null]).map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === activeIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Ir para ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
