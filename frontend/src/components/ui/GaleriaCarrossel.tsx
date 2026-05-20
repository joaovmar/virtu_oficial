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
    setActive(prev => {
      const next = prev + dir;
      if (next < 0) return imagens.length - 1;
      if (next >= imagens.length) return 0;
      return next;
    });
  }, [imagens.length]);

  if (!imagens || imagens.length === 0) return null;

  const getSrc = (img: GaleriaImagem) => img.imagem?.url || img.thumb?.url || '';
  const getAlt = (img: GaleriaImagem) => img.imagem?.alt || img.descricao || 'Galeria';

  const getPrev = () => imagens[(active - 1 + imagens.length) % imagens.length];
  const getNext = () => imagens[(active + 1) % imagens.length];

  const CARD_W  = 'clamp(280px, 52vw, 900px)';
  const SIDE_W  = 'clamp(100px, 18vw, 260px)';
  const HEIGHT  = 'clamp(200px, 38vw, 560px)';

  return (
    <>
      <section className="py-6 md:py-10 overflow-hidden w-full">

        {/* Título */}
        <h2 className="font-display italic text-xl md:text-2xl lg:text-3xl text-center text-virtu-dark mb-6 md:mb-10 px-4">
          {titulo}
        </h2>

        {/*
          Faixa 100% da largura da tela.
          Layout: [lateral esq] [card central] [lateral dir]
          O conjunto ocupa exactamente 100vw.
        */}
        <div className="relative flex items-center justify-center w-full" style={{ height: HEIGHT }}>

          {/* ── Lateral esquerda ─────────────────────── */}
          <div
            className="relative h-full flex-shrink-0 overflow-hidden cursor-pointer opacity-60 hover:opacity-75 transition-opacity"
            style={{ width: SIDE_W }}
            onClick={() => go(-1)}
          >
            {getSrc(getPrev()) && (
              <Image src={getSrc(getPrev())} alt={getAlt(getPrev())}
                fill className="object-cover object-right" sizes="20vw" />
            )}
          </div>

          {/* ── Card central com animação ─────────────── */}
          <div
            className="relative flex-shrink-0 h-full overflow-hidden mx-2 md:mx-4 shadow-2xl cursor-pointer"
            style={{ width: CARD_W }}
            onClick={() => setLightboxOpen(true)}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                variants={{
                  enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit:  (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0"
              >
                {getSrc(imagens[active]) && (
                  <Image
                    src={getSrc(imagens[active])}
                    alt={getAlt(imagens[active])}
                    fill
                    className="object-cover"
                    sizes="55vw"
                    priority
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Lateral direita ──────────────────────── */}
          <div
            className="relative h-full flex-shrink-0 overflow-hidden cursor-pointer opacity-60 hover:opacity-75 transition-opacity"
            style={{ width: SIDE_W }}
            onClick={() => go(1)}
          >
            {getSrc(getNext()) && (
              <Image src={getSrc(getNext())} alt={getAlt(getNext())}
                fill className="object-cover object-left" sizes="20vw" />
            )}
          </div>

          {/* ── Setas ────────────────────────────────── */}
          <button onClick={() => go(-1)}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-md transition-colors"
            aria-label="Anterior">
            <ChevronLeft className="w-4 h-4 text-virtu-dark" strokeWidth={2} />
          </button>
          <button onClick={() => go(1)}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-md transition-colors"
            aria-label="Próximo">
            <ChevronRight className="w-4 h-4 text-virtu-dark" strokeWidth={2} />
          </button>
        </div>

        {/* Dots */}
        {imagens.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-5 md:mt-7">
            {imagens.map((_, i) => (
              <button key={i} onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? 'bg-virtu-gold w-5' : 'bg-gray-300 w-1.5'
                }`}
                aria-label={`Imagem ${i + 1}`} />
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}>
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
          <motion.div key={active} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-5xl max-h-[85vh] w-full mx-14"
            onClick={(e) => e.stopPropagation()}>
            {imagens[active]?.imagem && (
              <Image src={imagens[active].imagem!.url} alt={getAlt(imagens[active])}
                width={imagens[active].imagem!.width || 1200}
                height={imagens[active].imagem!.height || 800}
                className="object-contain w-full h-full max-h-[85vh]" />
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
