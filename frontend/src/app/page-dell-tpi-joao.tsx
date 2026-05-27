'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getHome, HomeData } from '@/lib/api';
import FuturosLancamentosSection from '@/components/sections/FuturosLancamentosSection';
import LeadCaptureSection from '@/components/sections/LeadCaptureSection';
import VideoPlayer from '@/components/ui/VideoPlayer';

export default function HomePage() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try { const homeData = await getHome(); setData(homeData); }
      catch (e) { console.error('Erro:', e); }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  // Hero carousel: uses hero_banners array if available, fallback to hero_imagem
  const heroBanners = data?.hero_banners && data.hero_banners.length > 0
    ? data.hero_banners
    : data?.hero_imagem ? [{ imagem: data.hero_imagem, titulo: '', subtitulo: '' }] : [];

  const goHero = useCallback((dir: number) => {
    setHeroIdx(prev => {
      const len = heroBanners.length || 1;
      const n = prev + dir;
      return n < 0 ? len - 1 : n >= len ? 0 : n;
    });
  }, [heroBanners.length]);

  // Auto-slide hero
  useEffect(() => {
    if (heroBanners.length <= 1) return;
    const t = setInterval(() => goHero(1), 5000);
    return () => clearInterval(t);
  }, [heroBanners.length, goHero]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-4 border-virtu-gold border-t-transparent" /></div>;
  }

  const activeHero = heroBanners[heroIdx];

  return (
    <>
      {/* 1. HERO — 100% da viewport no primeiro scroll */}
      <section className="relative w-full h-[100svh] min-h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div key={heroIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }} className="absolute inset-0">
            {activeHero?.imagem?.url ? (
              <Image src={activeHero.imagem.url} alt={activeHero.titulo || ''} fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full bg-virtu-green-dark" />
            )}
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Texto do hero */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 md:pb-20 px-6 z-10">
          <motion.h1 key={`ht-${heroIdx}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-white text-center">
            <span className="font-sans font-light text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-tight">
              {activeHero?.titulo || data?.hero_titulo || ''}
            </span>
            {(activeHero?.subtitulo || (!activeHero?.titulo && data?.hero_titulo)) && (
              <span className="font-display font-medium italic text-virtu-gold text-2xl sm:text-3xl md:text-4xl lg:text-5xl ml-2">
                {activeHero?.subtitulo || 'propósito'}
              </span>
            )}
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-6 md:mt-8">
            {/* V da virtú como indicador de scroll */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="opacity-80"
            >
              <svg width="32" height="32" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#vclip)">
                  <path d="M13.5465 18.9383C13.5235 18.9383 13.4944 18.932 13.4714 18.932C11.6212 18.9081 10.2098 17.3722 9.03433 16.1953C7.67426 14.8325 6.29735 13.3085 4.9143 11.6296C4.90818 11.624 4.90282 11.6177 4.90282 11.6113L8.44084 11.6113C9.21889 12.4722 10.072 13.3561 10.677 13.8882C11.8004 14.8865 12.5157 15.5313 13.5005 15.5258C14.9127 15.5139 15.9725 14.2472 17.6382 12.257C17.8227 12.0362 17.9958 11.821 18.1566 11.6113L21.8447 11.6113C21.2681 12.3221 20.6746 13.0218 20.0987 13.727C19.4301 14.5458 18.7616 15.3582 18.093 16.1714C16.756 17.8027 15.1883 18.9383 13.5465 18.9383Z" fill="#C1A784"/>
                  <path d="M1.29541e-06 13.9996C1.63283e-06 6.28029 6.05676 2.64749e-07 13.5004 5.90121e-07C20.944 9.15492e-07 27 6.28029 27 13.9996C27 21.7189 20.944 27.9992 13.5004 27.9992C6.05676 27.9992 0.000767712 21.7189 0.00076805 13.9996L1.29541e-06 13.9996ZM25.0281 13.9996C25.0281 7.40801 19.8566 2.04498 13.5004 2.04498C7.1442 2.04498 1.97195 7.408 1.97195 14.0004C1.97195 20.5928 7.14343 25.9558 13.5004 25.9558C19.8573 25.9558 25.0281 20.592 25.0281 13.9996Z" fill="#C1A784"/>
                </g>
                <defs>
                  <clipPath id="vclip">
                    <rect width="28" height="27" fill="white" transform="translate(27 1.18021e-06) rotate(90)"/>
                  </clipPath>
                </defs>
              </svg>
            </motion.div>
          </motion.div>
        </div>

        {/* Setas do carrossel */}
        {heroBanners.length > 1 && (
          <>
            <button onClick={() => goHero(-1)} className="absolute left-3 sm:left-5 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center transition-colors" aria-label="Anterior">
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={2} />
            </button>
            <button onClick={() => goHero(1)} className="absolute right-3 sm:right-5 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center transition-colors" aria-label="Próximo">
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={2} />
            </button>
            <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-2.5">
              {heroBanners.map((_, i) => (
                <button key={i} onClick={() => setHeroIdx(i)} className={`h-2 md:h-2.5 rounded-full transition-all duration-300 ${i === heroIdx ? 'bg-white w-6 md:w-8' : 'bg-white/40 w-2 md:w-2.5'}`} aria-label={`Slide ${i + 1}`} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* 2. "Pensamos no futuro" */}
      <section className="py-10 md:py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row gap-6 lg:gap-16 items-start"
          >
            <div className="lg:w-[300px] shrink-0">
              <p className="font-sans font-extralight text-xl md:text-2xl lg:text-3xl text-virtu-dark leading-none">
                {data?.secao_futuro_titulo || ''}
              </p>
              <p className="font-display font-medium italic text-5xl md:text-6xl lg:text-8xl text-virtu-gold leading-[0.85] -mt-1">
                futuro
              </p>
            </div>
            <div className="flex-1">
              {data?.secao_futuro_texto && (
                <div className="font-sans font-light text-sm md:text-base text-virtu-dark leading-relaxed tracking-tight [&_p]:mb-4"
                  dangerouslySetInnerHTML={{ __html: data.secao_futuro_texto }} />
              )}
            </div>
          </motion.div>

          {/* Banner institucional */}
          {data?.banner_institucional_imagem && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-10 md:mt-14 lg:mt-16 relative w-full h-[220px] sm:h-[280px] md:h-[360px] lg:h-[420px] rounded-2xl md:rounded-[44px] overflow-hidden"
            >
              <Image src={data.banner_institucional_imagem.url} alt="" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/50" />
              {data.banner_institucional_texto && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 sm:pr-8 md:pr-14 max-w-[55%] md:max-w-[45%]">
                  <h3 className="text-white font-sans font-light text-base sm:text-lg md:text-2xl lg:text-3xl text-right leading-tight tracking-tight">
                    {data.banner_institucional_texto}
                  </h3>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* 3. Vídeo + "Todos os caminhos" */}
      <section className="py-8 md:py-10 lg:py-14 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-14">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="lg:w-[280px] shrink-0 text-center lg:text-left"
            >
              <h2 className="font-sans font-extralight text-2xl md:text-3xl lg:text-4xl text-virtu-green leading-[1.15]">
                Todos os<br />caminhos<br />se conectam<br />a <span className="font-bold text-virtu-green-dark">virtú.</span>
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="flex-1 w-full"
            >
              {data?.video_url ? (
                // Vídeo real cadastrado no Wagtail
                <VideoPlayer
                  videoId={
                    data.video_url.includes('youtube.com')
                      ? (data.video_url.split('v=')[1]?.split('&')[0] || '')
                      : data.video_url.includes('youtu.be')
                        ? data.video_url.split('youtu.be/')[1]?.split('?')[0] || ''
                        : data.video_url
                  }
                  title="vídeo institucional virtú"
                  thumbnailUrl={data.video_thumbnail?.url || '/video-thumb.jpg'}
                />
              ) : (
                // Placeholder quando não há vídeo cadastrado
                <div className="rounded-2xl md:rounded-[44px] overflow-hidden aspect-video relative bg-virtu-green-dark flex items-center justify-center">
                  <div className="text-center px-6">
                    <p className="text-white/50 font-sans text-sm">Vídeo institucional</p>
                    <p className="text-white/30 font-sans text-xs mt-1">Cadastre a URL no Wagtail &rsaquo; Home &rsaquo; Vídeo Institucional</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Futuros Lançamentos */}
      <FuturosLancamentosSection />

      {/* 5. Lead Capture — com grafismo e animação de scroll */}
      <LeadCaptureSection
        titulo={data?.empreendimento_destaque ? `${data.empreendimento_destaque.title}\n${data.empreendimento_destaque.cidade?.nome || ''} - ${data.empreendimento_destaque.cidade?.estado || ''}` : undefined}
        imagemFundo={data?.empreendimento_destaque?.imagem_principal?.url}
        showGrafismo={true}
      />
    </>
  );
}
