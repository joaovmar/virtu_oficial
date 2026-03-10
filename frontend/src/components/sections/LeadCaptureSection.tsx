'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { createLead, LeadData } from '@/lib/api';

/**
 * Lead Capture / Banner Empreendimento - Figma: node 1:141
 * Imagem: DJI_15_D (drone), com mask shape arredondado (44px corners)
 * Overlay: rgba(20,20,20,0.67)
 * "Cadastre-se e saiba mais!" - Sora SemiBold 30.315px, branco
 * Inputs: bg white, border #c1a784, rounded-[59.358px], Sora SemiBold
 * Labels: Sora SemiBold 20px, branco
 * Placeholders: #c9c9c9 Sora SemiBold 20px
 * Botão CTA: gradient from-[#348981] to-[#c1a784], rounded-[38.176px]
 * Texto esquerdo: "Breve lançamento" Sora Regular 24.375px
 * "Casas sobrado..." Sora Light 40px
 * Logos: Perplan + Virtú branco
 */

interface LeadCaptureSectionProps {
  titulo?: string;
  subtitulo?: string;
  imagemFundo?: string;
}

export default function LeadCaptureSection({
  titulo = 'Casas sobrado na\nregião da Vila do Golfe\nem Ribeirão Preto - SP',
  subtitulo = 'Breve lançamento',
  imagemFundo = '/vila-do-golfe-bg.jpg',
}: LeadCaptureSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { register, handleSubmit, reset } = useForm<LeadData>();

  const onSubmit = async (data: LeadData) => {
    setIsSubmitting(true);
    try {
      await createLead({
        ...data,
        origem: 'banner_home',
        pagina_origem: typeof window !== 'undefined' ? window.location.pathname : '',
      });
      setSubmitSuccess(true);
      reset();
    } catch {
      console.error('Erro ao enviar lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    'w-full px-6 py-3.5 bg-white border border-virtu-gold rounded-[59.358px] font-sans font-semibold text-[16px] md:text-[20px] text-virtu-dark placeholder:text-virtu-placeholder tracking-[-0.2px] focus:outline-none focus:ring-2 focus:ring-virtu-gold/40';

  return (
    <section className="relative mx-4 sm:mx-8 lg:mx-14 my-8 rounded-[44px] overflow-hidden">
      {/* Imagem de fundo */}
      <Image src={imagemFundo} alt="Empreendimento" fill className="object-cover" />
      {/* Overlay - Figma: rgba(20,20,20,0.67) */}
      <div className="absolute inset-0 bg-[rgba(20,20,20,0.67)]" />

      <div className="relative z-10 px-8 lg:px-20 py-14 md:py-20 flex flex-col lg:flex-row gap-12 lg:gap-20 justify-between items-center">
        {/* Esquerda: Info */}
        <div className="text-white lg:w-1/2">
          {/* Figma: Sora Regular 24.375px */}
          <span className="font-sans font-normal text-[20px] md:text-[24.375px] tracking-[-0.24px] mb-3 block">
            {subtitulo}
          </span>
          {/* Figma: Sora Light 40px */}
          <h2 className="font-sans font-light text-[28px] md:text-[40px] leading-tight whitespace-pre-line">
            {titulo}
          </h2>
          {/* Logos parceiros */}
          <div className="flex items-center gap-6 mt-10">
            <Image src="/perplan-logo-white.svg" alt="Perplan" width={213} height={85} className="object-contain opacity-90 h-[60px] md:h-[85px] w-auto" />
            <Image src="/virtu-logo-white.svg" alt="Virtú" width={110} height={44} className="object-contain opacity-90 h-[32px] md:h-[44px] w-auto" />
          </div>
        </div>

        {/* Direita: Form */}
        <div className="lg:w-[420px] w-full">
          {submitSuccess ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white py-10">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-sans font-semibold text-[24px] mb-2">Obrigado!</h3>
              <p className="text-white/80 text-[16px] font-light">Em breve entraremos em contato.</p>
            </motion.div>
          ) : (
            <>
              {/* Figma: Sora SemiBold 30.315px */}
              <h3 className="font-sans font-semibold text-[22px] md:text-[30.315px] text-white text-center tracking-[-0.3px] mb-6">
                Cadastre-se e saiba mais!
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block font-sans font-semibold text-[16px] md:text-[20px] text-white tracking-[-0.2px] mb-1.5">
                    Nome*
                  </label>
                  <input
                    type="text"
                    placeholder="Nome completo"
                    className={inputClasses}
                    {...register('nome', { required: true })}
                  />
                </div>
                <div>
                  <label className="block font-sans font-semibold text-[16px] md:text-[20px] text-white tracking-[-0.2px] mb-1.5">
                    E-mail*
                  </label>
                  <input
                    type="email"
                    placeholder="E-mail"
                    className={inputClasses}
                    {...register('email', { required: true })}
                  />
                </div>
                <div>
                  <label className="block font-sans font-semibold text-[16px] md:text-[20px] text-white tracking-[-0.2px] mb-1.5">
                    Telefone*
                  </label>
                  <input
                    type="tel"
                    placeholder="Telefone com DDD"
                    className={inputClasses}
                    {...register('telefone', { required: true })}
                  />
                </div>
                {/* Botão - Figma: gradient from-[#348981] to-[#c1a784], rounded-[38.176px], Sora Light 20px */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-[38.176px] font-sans font-light text-[16px] md:text-[20px] text-white bg-gradient-to-r from-virtu-green to-virtu-gold hover:opacity-90 transition-opacity disabled:opacity-60 mt-3"
                >
                  {isSubmitting ? 'Enviando...' : 'Fale com um especialista'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
