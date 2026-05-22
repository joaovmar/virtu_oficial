'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEmpreendimentos, EmpreendimentoCard } from '@/lib/api';

/**
 * Futuros Lançamentos
 *
 * Alimentado por empreendimentos cujo Status (slug) contenha:
 * breve | lancamento | lançamento | pre | futuro | em-breve
 *
 * Para aparecer aqui, no Wagtail:
 *   1. Páginas → Empreendimentos → [empreendimento] → Status de Vendas = "Breve Lançamento"
 *   2. Cadastrar Imagem Principal (Card) — essa é a foto de fundo do slider
 *   3. Publicar
 */
export default function FuturosLancamentosSection() {
  const [empreendimentos, setEmpreendimentos] = useState<EmpreendimentoCard[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const todos = await getEmpreendimentos();
        if (!Array.isArray(todos)) return;

        const futuros = todos.filter(e => {
          const slug = (e.status?.slug || '').toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // remove acentos
          return (
            slug.includes('breve') ||
            slug.includes('lancamento') ||
            slug.includes('lançamento') ||
            slug.includes('pre') ||
            slug.includes('futuro') ||
            slug.includes('em-breve')
          );
        });

        // Se não há futuros com esse status, exibe todos como fallback
        setEmpreendimentos(futuros.length > 0 ? futuros : todos);
      } catch {}
    }
    fetchData();
  }, []);

  const go = useCallback((dir: number) => {
    setIdx(prev => {
      const len = empreendimentos.length || 1;
      const next = prev + dir;
      if (next < 0) return len - 1;
      if (next >= len) return 0;
      return next;
    });
  }, [empreendimentos.length]);

  // Auto-slide a cada 6s
  useEffect(() => {
    if (empreendimentos.length <= 1) return;
    const timer = setInterval(() => go(1), 6000);
    return () => clearInterval(timer);
  }, [empreendimentos.length, go]);

  const activeEmp = empreendimentos.length > 0 ? empreendimentos[idx] : null;
  const bgUrl = activeEmp?.imagem_principal?.url || (activeEmp as any)?.imagem_hero?.url || null;

  return (
    <section className="py-10 md:py-14 lg:py-20 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="text-center mb-8 md:mb-12 px-4"
      >
        <p className="font-sans font-light text-xl sm:text-2xl md:text-3xl text-virtu-dark leading-none">Futuros</p>
        <p className="font-display font-medium italic text-3xl sm:text-4xl md:text-5xl text-virtu-green leading-[0.9]">lançamentos</p>
      </motion.div>

      <div className="relative w-full h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[65vh] min-h-[300px] max-h-[600px] overflow-hidden">

        {/* Fundo: imagem do empreendimento ou gradiente quando não há imagem */}
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            {bgUrl ? (
              <Image
                src={bgUrl}
                alt={activeEmp?.title || 'Futuro lançamento'}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-virtu-green-dark via-virtu-green to-[#1a4a40]" />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Texto */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-12 lg:p-16">
          <div className="max-w-6xl mx-auto">
            <motion.h3
              key={`title-${idx}`}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="text-white font-sans font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight mb-1 md:mb-3"
            >
              {activeEmp?.cidade
                ? `${activeEmp.cidade.nome} | ${activeEmp.cidade.estado}`
                : 'Ribeirão Preto | SP'}
            </motion.h3>
            <motion.p
              key={`desc-${idx}`}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-white/90 font-sans font-light text-xs sm:text-sm md:text-base tracking-tight max-w-2xl leading-relaxed"
            >
              {activeEmp?.descricao_curta || 'Ribeirão Preto, cidade que pulsa crescimento e qualidade de vida, em breve receberá novos lançamentos da virtú.'}
            </motion.p>
          </div>
        </div>

        {/* Setas */}
        <button onClick={() => go(-1)}
          className="absolute left-3 sm:left-5 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center transition-colors"
          aria-label="Anterior">
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={2} />
        </button>
        <button onClick={() => go(1)}
          className="absolute right-3 sm:right-5 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center transition-colors"
          aria-label="Próximo">
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={2} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:gap-2.5">
          {(empreendimentos.length > 0 ? empreendimentos : [null]).map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`h-2 md:h-2.5 rounded-full transition-all duration-300 ${
                i === idx ? 'bg-white w-6 md:w-8' : 'bg-white/40 w-2 md:w-2.5 hover:bg-white/60'
              }`}
              aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
