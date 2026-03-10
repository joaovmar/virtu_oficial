'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Target, Trophy, Handshake } from 'lucide-react';
import { getSobreNos, SobreNosData } from '@/lib/api';
import VideoPlayer from '@/components/ui/VideoPlayer';

/**
 * Página "A Virtú" / Quem Somos - Figma: "Web - 1º tiro - quem somos" (node 1:472)
 * 
 * Seções:
 * 1. Hero: "A virtú" (node 1:542) - Sora ExtraLight + bold italic
 * 2. "Nosso propósito" (node 1:502) - Sora ExtraLight 42px + Newsreader 128px
 * 3. Vídeo institucional (node 1:512)
 * 4. Missão/Visão/Valores sobre fundo dark (node 1:520)
 * 5. Política de qualidade (node 1:499)
 * 6. Selos PBQP-H
 */

export default function SobreNosPage() {
  const [data, setData] = useState<SobreNosData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const sobreData = await getSobreNos();
        setData(sobreData);
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
      {/* ================================================================
          1. HERO: "A virtú"
          Figma: imagem bg arredondada, overlay, texto centralizado
          "A" Sora ExtraLight + "virtú" Sora Bold Italic
          + seta grafismo
          ================================================================ */}
      <section className="relative h-[70vh] min-h-[500px] flex flex-col items-center justify-center">
        <div className="absolute inset-0 mx-4 md:mx-14 mt-2 rounded-b-[44px] overflow-hidden">
          <Image
            src={data?.hero_imagem?.url || '/hero-bg.jpg'}
            alt="A Virtú"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white font-sans"
          >
            {/* Figma: Sora ExtraLight + bold "virtú" */}
            <span className="font-extralight text-[40px] md:text-[60px]">A </span>
            <span className="font-bold italic text-[50px] md:text-[75px]">virtú</span>
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-8">
            <svg width="27" height="28" viewBox="0 0 27 28" fill="none" className="animate-bounce opacity-70 mx-auto">
              <path d="M13.5 2L13.5 26M13.5 26L25 14.5M13.5 26L2 14.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
      </section>

      {/* ================================================================
          2. "Nosso propósito"
          Figma: node 1:502
          Sora ExtraLight 42px + Newsreader Medium Italic 128px #c1a784
          ================================================================ */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-[1591px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:w-[434px] shrink-0">
              <p className="font-sans font-extralight text-[42px] text-virtu-dark leading-none">Nosso</p>
              <p className="font-display font-medium italic text-[100px] lg:text-[128px] text-virtu-gold leading-[0.85] -mt-2">propósito</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex-1">
              <div
                className="font-sans font-light text-[20px] text-virtu-dark leading-[1.474] tracking-[-0.2px] [&_p]:mb-5 [&_strong]:font-bold"
                dangerouslySetInnerHTML={{
                  __html: data?.historia_texto ||
                    '<p>A virtú nasce da união de profissionais com mais de duas décadas de atuação na construção civil, sustentada por parcerias sólidas e por uma trajetória marcada pela excelência. Com raízes sólidas e olhar voltado para o futuro, reunimos tradição e inovação para transformar o modo de viver e investir.</p><p>Somos uma incorporadora e urbanizadora dedicada ao segmento de médio e alto padrão, com projetos que unem funcionalidade, elegância e exclusividade. Cada empreendimento é pensado com propósito, cuidado minucioso e identidade própria, porque morar bem é viver uma experiência que combina conforto, beleza e significado.</p>',
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================
          3. Vídeo institucional
          Figma: node 1:512 - rounded-[44px], overlay
          ================================================================ */}
      <section className="py-8 md:py-16 bg-white">
        <div className="max-w-[1104px] mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <VideoPlayer
              videoId={data?.video_url?.includes('youtube') ? (data.video_url.split('v=')[1]?.split('&')[0] || '') : (data?.video_url || '')}
              title={data?.video_titulo || 'vídeo institucional virtú'}
              thumbnailUrl={data?.video_thumbnail?.url || '/video-thumb.jpg'}
            />
          </motion.div>
        </div>
      </section>

      {/* ================================================================
          4. Missão / Visão / Valores
          Figma: node 1:520, fundo dark (node 1:519 = "fundo 3 1")
          Cards: ícone 93x93, título Sora SemiBold 22.426px, texto Sora ExtraLight 14px
          ================================================================ */}
      <section className="bg-virtu-green-dark py-20 md:py-28 relative overflow-hidden">
        <div className="max-w-[1433px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            {/* Missão */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col items-center text-center">
              <div className="w-[93px] h-[93px] rounded-full bg-virtu-green/30 flex items-center justify-center mb-4">
                <Target className="w-[47px] h-[47px] text-white" strokeWidth={1.5} />
              </div>
              <h3 className="font-sans font-semibold text-[22.426px] text-white tracking-[-0.22px] mb-3">missão</h3>
              <p className="font-sans font-extralight text-[14px] text-white text-center tracking-[-0.14px] leading-normal max-w-[360px]">
                Construir e expandir um legado com <strong className="font-bold">propósito</strong>, oferecendo produtos que acompanhem a evolução dos nossos clientes, sustentados por uma cultura empresarial duradoura, autêntica e comprometida com oportunidades iguais para todos.
              </p>
            </motion.div>

            {/* Visão */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex flex-col items-center text-center">
              <div className="w-[93px] h-[93px] rounded-full bg-virtu-green/30 flex items-center justify-center mb-4">
                <Trophy className="w-[47px] h-[47px] text-white" strokeWidth={1.5} />
              </div>
              <h3 className="font-sans font-semibold text-[22.426px] text-white tracking-[-0.22px] mb-3">visão</h3>
              <p className="font-sans font-extralight text-[14px] text-white text-center tracking-[-0.14px] leading-normal max-w-[337px]">
                Construir, junto aos nossos clientes, um futuro <strong className="font-bold">sólido e virtuoso</strong>, com excelência, confiança e <strong className="font-bold">propósito</strong> em cada conquista.
              </p>
            </motion.div>

            {/* Valores */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col items-center text-center">
              <div className="w-[93px] h-[93px] rounded-full bg-virtu-green/30 flex items-center justify-center mb-4">
                <Handshake className="w-[47px] h-[47px] text-white" strokeWidth={1.5} />
              </div>
              <h3 className="font-sans font-semibold text-[22.426px] text-white tracking-[-0.22px] mb-3">valores</h3>
              <p className="font-sans font-extralight text-[14px] text-white text-center tracking-[-0.14px] leading-normal max-w-[398px]">
                <strong className="font-bold">Humildade</strong>, <strong className="font-bold">disciplina e ética</strong> como pilares das nossas relações e decisões; <strong className="font-bold">Excelência</strong>, como caminho para inovação e qualidade; Investimento em <strong className="font-bold">pessoas</strong> com foco em resultados e mérito; <strong className="font-bold">Compromisso</strong> com o cliente, entregando valor real em cada empreendimento; <strong className="font-bold">Exclusividade</strong>, projetos pensados para serem únicos;
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================
          5. Política de qualidade
          Figma: Sora SemiBold para título, Sora ExtraLight para texto
          ================================================================ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[1408px] mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-sans font-semibold text-[30px] text-virtu-green tracking-[-0.3px] mb-6">
              Política de qualidade
            </h2>
            <div
              className="font-sans font-extralight text-[18px] text-virtu-dark leading-relaxed tracking-[-0.18px] max-w-[1231px] [&_p]:mb-4"
              dangerouslySetInnerHTML={{
                __html: data?.politica_texto ||
                  '<p>A virtú Incorporadora e Urbanizadora através da otimização de seus processos, busca respeitar o atendimento aos requisitos aplicáveis, sempre com melhoria contínua para superar as expectativas de nossos clientes e partes interessadas com comprometimento, sustentabilidade, pontualidade e qualidade nas entregas dos empreendimentos.</p>',
              }}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12">
            <h3 className="font-sans font-semibold text-[24px] text-virtu-green tracking-[-0.24px] mb-6">
              Garantia e qualidade
            </h3>
            <div className="flex gap-8 items-center flex-wrap">
              <Image src="/pbqp-h.png" alt="PBQP-H" width={356} height={170} className="object-contain h-[100px] w-auto" />
              <Image src="/iso9001.png" alt="ISO 9001" width={282} height={104} className="object-contain h-[80px] w-auto" />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
