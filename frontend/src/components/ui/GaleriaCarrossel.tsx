'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { GaleriaImagem } from '@/lib/api';

interface GaleriaCarrosselProps {
  imagens: GaleriaImagem[];
  titulo?: string;
}

export default function GaleriaCarrossel({ imagens, titulo = "Galeria" }: GaleriaCarrosselProps) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const go = useCallback((dir: number) => {
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

  // Índices dos 3 cards visíveis: anterior, ativo, próximo
  const prev = (active - 1 + imagens.length) % imagens.length;
  const next = (active + 1) % imagens.length;
  const visible = [prev, active, next];

  return (
    <>
      <section className="py-6 md:py-8">

        {/* Título centralizado com margem */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display italic text-xl md:text-2xl lg:text-3xl text-center text-virtu-dark mb-6 md:mb-10">
            {titulo}
          </h2>
        </div>

        {/*
          Container 100vw — de borda a borda.
          3 imagens iguais, cada uma com 33.333% da largura total.
          Card central com sombra e leve destaque.
        */}
        <div className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden"
          style={{ height: 'clamp(220px, 40vh, 480px)' }}>

          <div className="flex h-full w-full">
            {visible.map((imgIndex, pos) => {
              const img = imagens[imgIndex];
              const isCenter = pos === 1;
              return (
                <motion.div
                  key={`${imgIndex}-${pos}`}
                  className="relative h-full cursor-pointer flex-shrink-0"
                  style={{ width: '33.333%' }}
                  animate={{ scale: isCenter ? 1.04 : 1, zIndex: isCenter ? 10 : 1 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => {
                    if (pos === 0) go(-1);
                    else if (pos === 2) go(1);
                    else setLightboxOpen(true);
                  }}
                >
                  {getSrc(img) && (
                    <Image
                      src={getSrc(img)}
                      alt={getAlt(img)}
                      fill
                      className={`object-cover transition-opacity duration-300 ${isCenter ? 'opacity-100' : 'opacity-70'}`}
                      sizes="33vw"
                      priority={isCenter}
                    />
                  )}
                  {isCenter && (
                    <div className="absolute inset-0 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.15)]" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Setas */}
          <button onClick={() => go(-1)}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-40 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow transition-colors"
            aria-label="Anterior">
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-virtu-dark" strokeWidth={2} />
          </button>
          <button onClick={() => go(1)}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-40 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow transition-colors"
            aria-label="Próximo">
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-virtu-dark" strokeWidth={2} />
          </button>
        </div>

        {/* Dots */}
        {imagens.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-5 md:mt-7">
            {imagens.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                  i === active ? 'bg-virtu-gold w-4 md:w-5' : 'bg-gray-300 w-1.5 md:w-2'
                }`}
                aria-label={`Imagem ${i + 1}`} />
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
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
          <motion.div key={active} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-5xl max-h-[80vh] w-full mx-12 md:mx-16"
            onClick={(e) => e.stopPropagation()}>
            {imagens[active]?.imagem && (
              <Image
                src={imagens[active].imagem!.url}
                alt={getAlt(imagens[active])}
                width={imagens[active].imagem!.width || 1200}
                height={imagens[active].imagem!.height || 800}
                className="object-contain w-full h-full max-h-[80vh]"
              />
            )}
          </motion.div>
          <button onClick={(e) => { e.stopPropagation(); go(1); }}
            className="absolute right-3 md:right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20"
            aria-label="Próximo">
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs font-sans">
            {active + 1} / {imagens.length}
          </div>
        </motion.div>
      )}
    </>
  );
}
