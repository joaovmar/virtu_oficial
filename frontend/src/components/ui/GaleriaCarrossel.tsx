'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { GaleriaImagem } from '@/lib/api';

interface GaleriaCarrosselProps {
  imagens: GaleriaImagem[];
  titulo?: string;
}

export default function GaleriaCarrossel({ imagens, titulo = "Galeria" }: GaleriaCarrosselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!imagens || imagens.length === 0) return null;

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, imagens.length - 4) : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev >= imagens.length - 4 ? 0 : prev + 1));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const lightboxPrev = () => {
    setLightboxIndex((prev) => (prev === 0 ? imagens.length - 1 : prev - 1));
  };

  const lightboxNext = () => {
    setLightboxIndex((prev) => (prev === imagens.length - 1 ? 0 : prev + 1));
  };

  // Imagens visíveis no carrossel (4 por vez no desktop)
  const visibleImages = imagens.slice(currentIndex, currentIndex + 4);
  // Se não tiver 4 imagens suficientes, completa do início
  if (visibleImages.length < 4 && imagens.length >= 4) {
    visibleImages.push(...imagens.slice(0, 4 - visibleImages.length));
  }

  return (
    <>
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-center text-virtu-dark mb-8">{titulo}</h2>
          
          <div className="relative">
            {/* Carrossel */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {visibleImages.map((img, index) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => openLightbox(currentIndex + index)}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
                >
                  {img.thumb && (
                    <Image
                      src={img.thumb.url}
                      alt={img.thumb.alt || img.descricao || 'Imagem da galeria'}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </motion.div>
              ))}
            </div>

            {/* Setas de navegação */}
            {imagens.length > 4 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-6 h-6 text-virtu-dark" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                  aria-label="Próximo"
                >
                  <ChevronRight className="w-6 h-6 text-virtu-dark" />
                </button>
              </>
            )}
          </div>

          {/* Indicadores */}
          {imagens.length > 4 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: Math.ceil(imagens.length / 4) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i * 4)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    Math.floor(currentIndex / 4) === i ? 'bg-virtu-gold' : 'bg-gray-300'
                  }`}
                  aria-label={`Ir para grupo ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
              className="absolute left-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-5xl max-h-[80vh] w-full mx-16"
              onClick={(e) => e.stopPropagation()}
            >
              {imagens[lightboxIndex]?.imagem && (
                <Image
                  src={imagens[lightboxIndex].imagem!.url}
                  alt={imagens[lightboxIndex].imagem!.alt || ''}
                  width={imagens[lightboxIndex].imagem!.width || 1200}
                  height={imagens[lightboxIndex].imagem!.height || 800}
                  className="object-contain w-full h-full max-h-[80vh]"
                />
              )}
              {imagens[lightboxIndex]?.descricao && (
                <p className="text-white text-center mt-4">{imagens[lightboxIndex].descricao}</p>
              )}
            </motion.div>

            <button
              onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
              className="absolute right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Próximo"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Contador */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">
              {lightboxIndex + 1} / {imagens.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
