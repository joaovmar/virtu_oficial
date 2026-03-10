'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getHome, getDepoimentos, HomeData, Depoimento } from '@/lib/api';
import JornadaSection from '@/components/sections/JornadaSection';
import FuturosLancamentosSection from '@/components/sections/FuturosLancamentosSection';
import DepoimentosSection from '@/components/sections/DepoimentosSection';
import LeadCaptureSection from '@/components/sections/LeadCaptureSection';

/**
 * HOME PAGE - Figma: "Web - 1º tiro - home" (node 1:97)
 * 
 * Seções:
 * 1. Hero banner (node 1:128) - "O seu futuro é o nosso propósito"
 * 2. "Pensamos no futuro" + texto (node 1:121)
 * 3. "Todos os caminhos se conectam a virtú." + vídeo (node 1:129)
 * 4. "Futuros lançamentos" (node 1:138 + 1:139)
 * 5. Banner empreendimento Lead Capture (node 1:141)
 */

export default function HomePage() {
  const [data, setData] = useState<HomeData | null>(null);
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [homeData, depoimentosData] = await Promise.all([
          getHome(),
          getDepoimentos(true),
        ]);
        setData(homeData);
        setDepoimentos(depoimentosData);
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
      {/* ================================================================
          1. HERO BANNER
          Figma: 1920x1080, imagem bg, overlay gradient, texto centralizado
          "O seu futuro é o nosso propósito"
          Sora Light + Newsreader Medium Italic #c1a784
          ================================================================ */}
      <section className="relative h-screen min-h-[700px] flex flex-col items-center justify-end pb-24 md:pb-32">
        <div className="absolute inset-0 z-0">
          <Image
            src={data?.hero_imagem?.url || '/familia-hero-bg.jpg'}
            alt="Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        </div>

        <div className="relative z-10 text-center flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white font-sans font-light text-[28px] md:text-[42px] tracking-[-0.4px]"
          >
            {data?.hero_titulo || 'O seu futuro é o nosso'}{' '}
            <span className="font-display font-medium italic text-virtu-gold text-[40px] md:text-[65px]">
              propósito
            </span>
          </motion.h1>

          {/* Seta scroll - Figma: grafismo-seta 1 (node 1:114) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-10"
          >
            <svg width="27" height="28" viewBox="0 0 27 28" fill="none" className="animate-bounce opacity-70">
              <path d="M13.5 2L13.5 26M13.5 26L25 14.5M13.5 26L2 14.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
      </section>

      {/* ================================================================
          2. "Pensamos no futuro" + texto
          Figma: 1ª dobra - home (node 1:121)
          Título: Sora ExtraLight 42px #282828 + Newsreader Medium Italic 128px #c1a784
          Texto: Sora Light 20px #282828, tracking: -0.2px
          ================================================================ */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-[1460px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            {/* Título esquerdo - Figma: 344px largo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-[344px] shrink-0"
            >
              <p className="font-sans font-extralight text-[42px] text-virtu-dark leading-none">
                {data?.secao_futuro_titulo || 'Pensamos no'}
              </p>
              <p className="font-display font-medium italic text-[128px] text-virtu-gold leading-[0.85] -mt-2">
                futuro
              </p>
            </motion.div>

            {/* Texto direito - Figma: Sora Light 20px tracking -0.2px */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <div
                className="font-sans font-light text-[20px] text-virtu-dark leading-[1.474] tracking-[-0.2px] [&_p]:mb-5"
                dangerouslySetInnerHTML={{
                  __html:
                    data?.secao_futuro_texto ||
                    '<p>A virtú tem um propósito claro: desenvolver empreendimentos com responsabilidade, sensibilidade e visão de futuro. O nome carrega aquilo em que acreditamos — a virtude como essência de tudo o que fazemos.</p><p>Nosso propósito é atender com excelência e superar as expectativas dos nossos clientes, por meio de empreendimentos entregues com qualidade e foco em valorização de longo prazo.</p>',
                }}
              />
            </motion.div>
          </div>

          {/* Banner institucional com imagem - Figma: Mask group arredondado */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 relative w-full h-[400px] md:h-[465px] rounded-[44px] overflow-hidden"
          >
            <Image
              src={data?.banner_institucional_imagem?.url || '/engineer-bg.jpg'}
              alt="Banner institucional"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/50" />
            <div className="absolute inset-y-0 right-0 flex items-center pr-10 md:pr-20 max-w-[50%]">
              <h3 className="text-white font-sans font-light text-[28px] md:text-[42px] text-right leading-tight tracking-[-0.4px]">
                {data?.banner_institucional_texto || 'criar lugares onde a vida acontece.'}
              </h3>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================
          3. "Todos os caminhos se conectam a virtú." + Vídeo
          Figma: Group 66 (node 1:129)
          Texto: Sora ExtraLight 50px #348981, "virtú." Sora Bold #1e3d34
          Vídeo: rounded-[44px], overlay rgba(0,0,0,0.6), texto Sora SemiBold 55.565px
          ================================================================ */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="max-w-[1672px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Texto - Figma: 321px x 252px, Sora ExtraLight 50px */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-[321px] shrink-0"
            >
              <h2 className="font-sans font-extralight text-[36px] lg:text-[50px] text-virtu-green leading-[1.1]">
                Todos os<br />
                caminhos<br />
                se conectam<br />
                a <span className="font-bold text-virtu-green-dark">virtú.</span>
              </h2>
            </motion.div>

            {/* Vídeo - Figma: 886x474, rounded-[44px] */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 w-full"
            >
              <div className="rounded-[44px] overflow-hidden aspect-video relative bg-black flex items-center justify-center cursor-pointer group">
                <Image
                  src="/video-thumb.jpg"
                  alt="Vídeo institucional"
                  fill
                  className="object-cover opacity-50 group-hover:opacity-60 transition-opacity duration-500"
                />
                {/* Overlay - Figma: rgba(0,0,0,0.6) */}
                <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)] group-hover:bg-[rgba(0,0,0,0.5)] transition-colors" />

                <div className="relative z-10 text-center flex flex-col items-center">
                  {/* Figma: Sora SemiBold 55.565px */}
                  <h3 className="text-white font-sans font-semibold text-[28px] md:text-[55px] tracking-[-0.56px] text-center mb-6 leading-tight">
                    vídeo institucional virtú
                  </h3>
                  {/* Play button - Figma: triângulo rotacionado */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center"
                  >
                    <svg width="69" height="93" viewBox="0 0 69 93" fill="none">
                      <path d="M69 46.5L0 93L0 0L69 46.5Z" fill="white" fillOpacity="0.8"/>
                    </svg>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================
          4. "Futuros lançamentos"
          Figma: Sora Light 50px #282828 + Newsreader Medium Italic 75px #348981
          + Banner - futuros lançamentos (node 1:139)
          ================================================================ */}
      <FuturosLancamentosSection />

      {/* ================================================================
          5. Banner Empreendimento - Lead Capture
          Figma: banner empreendimento - empreendimentos (node 1:141)
          ================================================================ */}
      <LeadCaptureSection
        titulo={
          data?.empreendimento_destaque
            ? `${data.empreendimento_destaque.title}\n${data.empreendimento_destaque.cidade?.nome || ''} - ${data.empreendimento_destaque.cidade?.estado || ''}`
            : undefined
        }
        imagemFundo={data?.empreendimento_destaque?.imagem_principal?.url}
      />
    </>
  );
}
