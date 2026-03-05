'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { getSobreNos, SobreNosData } from '@/lib/api';

export default function SobreNosPage() {
  const [data, setData] = useState<SobreNosData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const sobreData = await getSobreNos();
        setData(sobreData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-virtu-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      {/* 1. Hero Section */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src={data?.hero_imagem?.url || '/hero-bg.jpg'}
            alt="A Virtú"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 text-center -mt-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-5xl md:text-7xl font-sans font-light tracking-wide flex items-baseline gap-4"
          >
            {data?.hero_titulo || 'A'} <span className="font-display font-medium italic mb-2">virtú</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute -bottom-32 left-1/2 -translate-x-1/2"
          >
            <ChevronDown className="text-white w-8 h-8 animate-bounce opacity-70" strokeWidth={1.5} />
          </motion.div>
        </div>
      </section>

      {/* 2. Nossa história */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col xl:flex-row gap-16 items-start">
            <div className="xl:w-1/2">
              <div className="flex flex-col lg:flex-row items-baseline gap-6 mb-8">
                <div className="flex flex-col">
                  <span className="font-sans text-xl uppercase tracking-[0.2em] text-gray-500 mb-[-10px]">{data?.historia_titulo || 'Nossa'}</span>
                  <h2 className="font-display text-5xl md:text-7xl italic text-virtu-gold leading-none">história</h2>
                </div>
              </div>

              <div
                className="text-gray-600 font-sans font-light text-lg leading-relaxed flex flex-col gap-6 max-w-2xl"
                dangerouslySetInnerHTML={{ __html: data?.historia_texto || '<p>A virtú nasce da união e experiência de três mentes idealizadoras de atuar e inovar no ramo da incorporação.</p>' }}
              />
            </div>

            <div className="xl:w-1/2 w-full mt-12 xl:mt-0 relative z-10">
              <div className="rounded-2xl overflow-hidden shadow-xl aspect-video relative bg-virtu-dark flex items-center justify-center group cursor-pointer">
                <Image
                  src={data?.video_thumbnail?.url || "/video-thumb.jpg"}
                  alt="Vídeo institucional"
                  fill
                  className="object-cover opacity-60 group-hover:opacity-75 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                <div className="relative z-10 text-center flex flex-col items-center">
                  <h3 className="text-white text-3xl font-display italic mb-6">{data?.video_titulo || 'vídeo institucional virtú'}</h3>
                  <motion.div whileHover={{ scale: 1.1 }} className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-2" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Missão, Visão e Valores (Curved Background) */}
      <section className="bg-curved-green py-16 md:py-24 text-center text-white min-h-[500px] flex items-center relative -mt-10 pt-24 md:pt-32 pb-20 md:pb-32 z-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6">
                <Image src="/icons/missao.svg" width={32} height={32} alt="Missão" className="invert" />
              </div>
              <h3 className="font-sans font-medium text-lg tracking-widest uppercase mb-4">{data?.missao_titulo || 'missão'}</h3>
              <div className="text-white/80 text-sm leading-relaxed max-w-xs text-center font-light" dangerouslySetInnerHTML={{ __html: data?.missao_texto || 'Construir e inovar com o propósito genuíno.' }} />
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6">
                <Image src="/icons/visao.svg" width={32} height={32} alt="Visão" className="invert" />
              </div>
              <h3 className="font-sans font-medium text-lg tracking-widest uppercase mb-4">{data?.visao_titulo || 'visão'}</h3>
              <div className="text-white/80 text-sm leading-relaxed max-w-xs text-center font-light" dangerouslySetInnerHTML={{ __html: data?.visao_texto || 'Destinar recursos à construção de um futuro ético.' }} />
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6">
                <Image src="/icons/valores.svg" width={32} height={32} alt="Valores" className="invert" />
              </div>
              <h3 className="font-sans font-medium text-lg tracking-widest uppercase mb-4">{data?.valores_titulo || 'valores'}</h3>
              <div className="text-white/80 text-sm leading-relaxed max-w-xs text-center font-light" dangerouslySetInnerHTML={{ __html: data?.valores_texto || 'Priorizar a sustentabilidade ambiental como princípio orientador.' }} />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Política de Qualidade */}
      <section className="py-16 md:py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="font-sans font-bold text-3xl text-virtu-green mb-6">{data?.politica_titulo || 'Política de qualidade'}</h2>
            <div className="text-gray-600 font-light max-w-4xl text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: data?.politica_texto || 'A Virtú Incorporadora e Urbanismo é guiada por uma dedicação inesgotável...' }} />
          </div>

          <div>
            <h2 className="font-sans font-bold text-2xl text-virtu-green mb-6">Garantia e qualidade</h2>
            <div className="flex gap-8 items-center">
              <Image src="/pbqp-h.png" alt="PBQP-H" width={220} height={80} className="object-contain" />
              <Image src="/iso9001.png" alt="ISO 9001" width={220} height={80} className="object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="py-16 md:py-32 relative text-center">
        <Image src={data?.cta_imagem?.url || "/hero-bg.jpg"} fill className="object-cover" alt="CTA bg" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col items-center px-4">
          <h2 className="font-display italic text-4xl lg:text-5xl text-white mb-8 max-w-3xl leading-snug">
            {data?.cta_titulo || 'Pronto para fazer parte de nossa história?'}
          </h2>
          {data?.cta_subtitulo && (
            <p className="text-white/80 mb-8 max-w-2xl text-lg">{data.cta_subtitulo}</p>
          )}
          <button className="bg-virtu-gold px-8 py-3 rounded text-white font-sans text-sm tracking-widest uppercase hover:bg-virtu-gold-dark transition-colors">
            {data?.cta_botao_texto || 'Entrar em contato'}
          </button>
        </div>
      </section>
    </>
  );
}
