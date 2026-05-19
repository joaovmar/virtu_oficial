'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { createLead, getConfiguracoes, LeadData } from '@/lib/api';

interface LeadCaptureSectionProps {
  titulo?: string;
  subtitulo?: string;
  imagemFundo?: string;
  showGrafismo?: boolean;
}

export default function LeadCaptureSection({
  titulo = 'Casas sobrado na\nregião da Vila do Golfe\nem Ribeirão Preto - SP',
  subtitulo = 'Breve lançamento',
  imagemFundo,
  showGrafismo = false,
}: LeadCaptureSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [bgImage, setBgImage] = useState(imagemFundo || '');
  const [wrapperImage, setWrapperImage] = useState('');
  const { register, handleSubmit, reset } = useForm<LeadData>();

  useEffect(() => {
    if (imagemFundo) {
      setBgImage(imagemFundo);
      return;
    }
    getConfiguracoes()
      .then((config) => {
        // Imagem DENTRO do card
        if (config.banner_cta_imagem?.url) setBgImage(config.banner_cta_imagem.url);
        // Imagem AO REDOR do card (wrapper) — editável no Wagtail
        if ((config as any).banner_cta_wrapper_imagem?.url)
          setWrapperImage((config as any).banner_cta_wrapper_imagem.url);
      })
      .catch(() => {});
  }, [imagemFundo]);

  const onSubmit = async (data: LeadData) => {
    setIsSubmitting(true);
    try {
      await createLead({
        ...data,
        origem: 'banner_cta',
        pagina_origem: typeof window !== 'undefined' ? window.location.pathname : '',
      });
      setSubmitSuccess(true);
      reset();
    } catch {} finally { setIsSubmitting(false); }
  };

  const inputCls = 'w-full px-4 md:px-5 py-2.5 md:py-3 bg-white border border-virtu-gold rounded-full font-sans font-semibold text-xs md:text-sm text-virtu-dark placeholder:text-virtu-placeholder tracking-tight focus:outline-none focus:ring-2 focus:ring-virtu-gold/40';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="relative px-3 sm:px-6 lg:px-14 py-14 md:py-20 lg:py-24 bg-[#f5f6f4] overflow-hidden"
    >
      {/* Imagem AO REDOR do card — editável no Wagtail em Configurações > Banner CTA > Imagem de Fundo ao Redor do Card */}
      {wrapperImage && (
        <>
          <Image
            src={wrapperImage}
            alt=""
            fill
            className="object-cover"
            aria-hidden
          />
          <div className="absolute inset-0 bg-black/10" aria-hidden />
        </>
      )}
      <section className="relative z-10 rounded-2xl md:rounded-[44px] overflow-hidden">
        {/* Imagem de fundo editável no backoffice */}
        {bgImage ? (
          <Image src={bgImage} alt="" fill className="object-cover" />
        ) : (
          // Fundo verde escuro padrão quando não há imagem cadastrada
          <div className="absolute inset-0 bg-virtu-green-dark" />
        )}

        {/* Overlay escuro para legibilidade */}
        <div className="absolute inset-0 bg-[rgba(15,30,25,0.72)]" />

        {/* Grafismo decorativo — arcos concêntricos editáveis via showGrafismo */}
        {showGrafismo && (
          <div className="absolute inset-0 pointer-events-none z-[2] opacity-[0.10]" aria-hidden>
            <svg viewBox="0 0 900 600" fill="none"
              className="absolute right-0 top-0 h-full w-1/2"
              preserveAspectRatio="xMaxYMid meet">
              <circle cx="500" cy="300" r="420" stroke="white" strokeWidth="0.6" />
              <circle cx="500" cy="300" r="330" stroke="white" strokeWidth="0.6" />
              <circle cx="500" cy="300" r="240" stroke="white" strokeWidth="0.6" />
              <circle cx="500" cy="300" r="150" stroke="white" strokeWidth="0.6" />
              <circle cx="500" cy="300" r="70"  stroke="white" strokeWidth="0.6" />
              <path d="M500 -120 A420 420 0 0 1 920 300" stroke="white" strokeWidth="1.2" fill="none" />
              <path d="M500 -30  A330 330 0 0 1 830 300" stroke="white" strokeWidth="1"   fill="none" />
              <line x1="80"  y1="300" x2="920" y2="300" stroke="white" strokeWidth="0.4" />
              <line x1="500" y1="-120" x2="500" y2="720" stroke="white" strokeWidth="0.4" />
            </svg>
          </div>
        )}

        {/* Conteúdo */}
        <div className="relative z-[3] px-6 sm:px-10 lg:px-16 py-10 md:py-14 lg:py-20
          flex flex-col lg:flex-row gap-10 lg:gap-20 justify-between items-center">

          {/* Esquerda: texto + logos — largura flexível */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white lg:flex-1 text-center lg:text-left"
          >
            <span className="font-sans font-normal text-xs md:text-sm lg:text-base tracking-tight mb-1 md:mb-2 block">
              {subtitulo}
            </span>
            <h2 className="font-sans font-light text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight whitespace-pre-line">
              {titulo}
            </h2>
            <div className="flex items-center justify-center lg:justify-start gap-3 md:gap-5 mt-5 md:mt-8">
              <Image src="/perplan-logo-white.svg" alt="Perplan" width={160} height={65}
                className="object-contain h-[28px] sm:h-[36px] md:h-[50px] w-auto" />
              <Image src="/virtu-logo-white.svg" alt="virtú" width={85} height={34}
                className="object-contain h-[16px] sm:h-[20px] md:h-[28px] w-auto" />
            </div>
          </motion.div>

          {/* Direita: formulário — largura maior e centralizado */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative w-full lg:w-[420px] xl:w-[460px] max-w-[460px] mx-auto lg:mx-0"
          >
            {submitSuccess ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center text-white py-6">
                <p className="font-sans font-semibold text-lg mb-1">Obrigado!</p>
                <p className="text-white/80 text-sm font-light">Entraremos em contato.</p>
              </motion.div>
            ) : (
              <>
                <h3 className="font-sans font-semibold text-base md:text-lg text-white text-center tracking-tight mb-4">
                  Cadastre-se e saiba mais!
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5 md:space-y-3">
                  <div>
                    <label className="block font-sans font-semibold text-xs md:text-sm text-white tracking-tight mb-1">Nome*</label>
                    <input type="text" placeholder="Nome completo" className={inputCls}
                      {...register('nome', { required: true })} />
                  </div>
                  <div>
                    <label className="block font-sans font-semibold text-xs md:text-sm text-white tracking-tight mb-1">E-mail*</label>
                    <input type="email" placeholder="E-mail" className={inputCls}
                      {...register('email', { required: true })} />
                  </div>
                  <div>
                    <label className="block font-sans font-semibold text-xs md:text-sm text-white tracking-tight mb-1">Telefone*</label>
                    <input type="tel" placeholder="Telefone com DDD" className={inputCls}
                      {...register('telefone', { required: true })} />
                  </div>
                  <button type="submit" disabled={isSubmitting}
                    className="w-full py-2.5 md:py-3 rounded-full font-sans font-light text-xs md:text-sm text-white bg-gradient-to-r from-virtu-green to-virtu-gold hover:opacity-90 transition-opacity disabled:opacity-60 mt-2">
                    {isSubmitting ? 'Enviando...' : 'Fale com um especialista'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
