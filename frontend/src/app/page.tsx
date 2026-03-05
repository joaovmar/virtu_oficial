'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getHome, HomeData } from '@/lib/api';
import LeadCaptureSection from '@/components/sections/LeadCaptureSection';
import FuturosLancamentosSection from '@/components/sections/FuturosLancamentosSection';

export default function HomePage() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const homeData = await getHome();
        setData(homeData);
      } catch (error) {
        console.error('Erro:', error);
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
      {/* 1. Hero: O seu futuro é o nosso propósito */}
      <section className="relative h-[80vh] flex flex-col items-center justify-end pb-16 md:pb-32">
        <div className="absolute inset-0 z-0">
          <Image
            src={data?.hero_imagem?.url || '/familia-hero-bg.jpg'}
            alt="Família"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 text-center flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-3xl md:text-5xl font-sans font-light tracking-wide flex flex-col md:flex-row items-center gap-3"
          >
            {data?.hero_titulo || "O seu futuro é o nosso"} <span className="font-display font-medium italic text-virtu-gold text-5xl md:text-6xl">propósito</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8"
          >
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2 opacity-70">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Pensando no Futuro */}
      <section className="py-16 md:py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-5/12">
              <div className="flex flex-col mb-8">
                <span className="font-sans text-xl uppercase tracking-[0.2em] text-gray-500 mb-[-10px]">{data?.secao_futuro_titulo || 'Pensando no'}</span>
                <h2 className="font-display text-6xl md:text-7xl italic text-virtu-gold leading-none">futuro</h2>
              </div>
            </div>

            <div className="lg:w-7/12">
              <div className="text-gray-600 font-sans font-light text-lg leading-relaxed flex flex-col gap-6" dangerouslySetInnerHTML={{ __html: data?.secao_futuro_texto || '<p>A virtú, com um percurso claro, desenvolve empreendimentos com foco estritamente voltados à família e à sociedade.</p><p>O nosso propósito é concretizar os sonhos de milhares de famílias.</p>' }} />
            </div>
          </div>

          {/* Image Banner */}
          <div className="mt-24 relative w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={data?.banner_institucional_imagem?.url || "/engineer-bg.jpg"}
              alt="Engenheiro"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-y-0 right-12 flex items-center pr-12">
              <h3 className="text-white font-sans font-medium text-4xl md:text-5xl text-right leading-tight max-w-sm">
                {data?.banner_institucional_texto || 'criar lugares onde a vida acontece.'}
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Todos caminhos se conectam / Vídeo */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-white">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
          <div className="absolute -left-[20%] top-0 w-[80%] h-[120%] bg-virtu-cream/40 rounded-full blur-[100px]" />
          <div className="absolute -right-[10%] bottom-0 w-[60%] h-[100%] bg-virtu-cream/30 rounded-full blur-[80px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
          <div className="lg:w-1/3">
            <h2 className="font-sans font-light text-4xl lg:text-5xl text-virtu-green leading-snug">
              Todas os<br />
              caminhos<br />
              se conectam<br />
              a <strong className="font-display italic font-medium">virtú.</strong>
            </h2>
          </div>

          <div className="lg:w-2/3 w-full">
            <div className="rounded-2xl overflow-hidden shadow-xl aspect-video relative bg-virtu-dark flex items-center justify-center cursor-pointer group">
              <Image
                src="/video-thumb.jpg"
                alt="Vídeo institucional"
                fill
                className="object-cover opacity-60 group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

              <div className="relative z-10 text-center flex flex-col items-center">
                <h3 className="text-white text-3xl font-display italic mb-6">vídeo institucional <br />virtú</h3>
                <motion.div whileHover={{ scale: 1.1 }} className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-2" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Futuros Lançamentos Slider */}
      <FuturosLancamentosSection />

      {/* 5. Lead Capture (curved green background) */}
      <div className="bg-curved-green py-16 md:py-24 -mt-16 pt-24 md:pt-32">
        <LeadCaptureSection
          titulo={data?.empreendimento_destaque ?
            `${data.empreendimento_destaque.title}\n${data.empreendimento_destaque.cidade?.nome || ''} - ${data.empreendimento_destaque.cidade?.estado || ''}` : undefined}
          imagemFundo={data?.empreendimento_destaque?.imagem_principal?.url}
        />
      </div>
    </>
  );
}
