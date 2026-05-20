'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { GaleriaImagem } from '@/lib/api';

interface GaleriaCarrosselProps {
  imagens: GaleriaImagem[];
  titulo?: string;
}

export default function GaleriaCarrossel({ imagens, titulo = 'Galeria' }: GaleriaCarrosselProps) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const go = useCallback((dir: number) => {
    setDirection(dir);
    setActive(prev => (prev + dir + imagens.length) % imagens.length);
  }, [imagens.length]);

  if (!imagens || imagens.length === 0) return null;

  const getSrc = (img: GaleriaImagem) => img.imagem?.url || img.thumb?.url || '';
  const getAlt = (img: GaleriaImagem) => img.imagem?.alt || img.descricao || 'Galeria';

  const idxPrev = (active - 1 + imagens.length) % imagens.length;
  const idxNext = (active + 1) % imagens.length;

  // Larguras: lateral 22%, central 56%, lateral 22% = 100%
  const SIDE_PCT   = 22;
  const CENTER_PCT = 56;
  const HEIGHT     = 'clamp(200px, 38vw, 520px)';

  return (
    <>
      <section className="py-6 md:py-10 w-full">

        {/* Título */}
        <h2 className="font-display italic text-xl md:text-2xl lg:text-3xl text-center text-virtu-dark mb-6 md:mb-10 px-4">
          {titulo}
        </h2>

        {/*
          Faixa 100vw — três imagens lado a lado preenchendo toda a tela.
          Sem margens externas, sem padding lateral.
        */}
        <div
          className="relative flex items-stretch w-full overflow-hidden"
          style={{ height: HEIGHT }}
        >
          {/* ── LATERAL ESQUERDA ─────────────────────────────── */}
          <div
            className="relative flex-shrink-0 overflow-hidden cursor-pointer"
            style={{ width: `${SIDE_PCT}%` }}
            onClick={() => go(-1)}
          >
            <Image
              src={getSrc(imagens[idxPrev])}
              alt={getAlt(imagens[idxPrev])}
              fill
              className="object-cover brightness-75 transition-all duration-500"
              sizes={`${SIDE_PCT}vw`}
            />
            {/* Sombra suave topo e base */}
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </div>

          {/* ── CARD CENTRAL com animação ─────────────────────── */}
          <div
            className="relative flex-shrink-0 overflow-hidden cursor-pointer"
            style={{ width: `${CENTER_PCT}%` }}
            onClick={() => setLightboxOpen(true)}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                variants={{
                  enter:  (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0.6 }),
                  center: { x: '0%', opacity: 1 },
                  exit:   (d: number) => ({ x: d > 0 ? '-30%' : '30%', opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={getSrc(imagens[active])}
                  alt={getAlt(imagens[active])}
                  fill
                  className="object-cover"
                  sizes={`${CENTER_PCT}vw`}
                  priority
                />
                {/* Sombra suave topo e base — sem laterais */}
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── LATERAL DIREITA ───────────────────────────────── */}
          <div
            className="relative flex-shrink-0 overflow-hidden cursor-pointer"
            style={{ width: `${SIDE_PCT}%` }}
            onClick={() => go(1)}
          >
            <Image
              src={getSrc(imagens[idxNext])}
              alt={getAlt(imagens[idxNext])}
              fill
              className="object-cover brightness-75 transition-all duration-500"
              sizes={`${SIDE_PCT}vw`}
            />
            {/* Sombra suave topo e base */}
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </div>

          {/* ── Setas de navegação ────────────────────────────── */}
          <button
            onClick={() => go(-1)}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-md transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-4 h-4 text-virtu-dark" strokeWidth={2} />
          </button>
          <button
            onClick={() => go(1)}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-md transition-colors"
            aria-label="Próximo"
          >
            <ChevronRight className="w-4 h-4 text-virtu-dark" strokeWidth={2} />
          </button>
        </div>

        {/* Dots */}
        {imagens.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-5 md:mt-7">
            {imagens.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? 'bg-virtu-gold w-5' : 'bg-gray-300 w-1.5'
                }`}
                aria-label={`Imagem ${i + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 z-10"
            aria-label="Fechar">
            <X className="w-5 h-5 text-white" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); go(-1); }}
            className="absolute left-3 md:left-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20"
            aria-label="Anterior">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-5xl max-h-[85vh] w-full mx-14"
            onClick={(e) => e.stopPropagation()}
          >
            {imagens[active]?.imagem && (
              <Image
                src={imagens[active].imagem!.url}
                alt={getAlt(imagens[active])}
                width={imagens[active].imagem!.width || 1200}
                height={imagens[active].imagem!.height || 800}
                className="object-contain w-full h-full max-h-[85vh]"
              />
            )}
          </motion.div>
          <button onClick={(e) => { e.stopPropagation(); go(1); }}
            className="absolute right-3 md:right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20"
            aria-label="Próximo">
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-xs font-sans">
            {active + 1} / {imagens.length}
          </div>
        </motion.div>
      )}
    </>
  );
}
