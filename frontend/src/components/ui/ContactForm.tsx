'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { createLead, LeadData } from '@/lib/api';

/**
 * ContactForm - Figma design tokens:
 * Inputs: border #c1a784, rounded-[59.358px], Sora SemiBold 20px
 * Labels: Sora SemiBold 20px
 * Placeholders: #c9c9c9
 * Botão: gradient from-[#348981] to-[#c1a784], rounded-[38.176px]
 */

interface ContactFormProps {
  title?: string;
  empreendimentoId?: number;
  className?: string;
}

export default function ContactForm({
  title = 'Cadastre-se e saiba mais!',
  empreendimentoId,
  className = '',
}: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LeadData>();

  const onSubmit = async (data: LeadData) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await createLead({
        ...data,
        empreendimento: empreendimentoId,
        pagina_origem: typeof window !== 'undefined' ? window.location.pathname : '',
      });
      setSubmitSuccess(true);
      reset();
    } catch {
      setSubmitError('Erro ao enviar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* Figma input style: border #c1a784, rounded-[59.358px] */
  const inputBase =
    'w-full px-6 py-3.5 bg-white border border-virtu-gold rounded-[59.358px] font-sans font-semibold text-[16px] text-virtu-dark placeholder:text-virtu-placeholder tracking-[-0.16px] focus:outline-none focus:ring-2 focus:ring-virtu-gold/40';

  return (
    <div className={`p-7 md:p-8 ${className}`}>
      <AnimatePresence mode="wait">
        {submitSuccess ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-sans font-semibold text-[24px] text-virtu-dark mb-2">Obrigado!</h3>
            <p className="text-virtu-muted font-sans text-[14px] font-light">Em breve entraremos em contato.</p>
            <button onClick={() => setSubmitSuccess(false)} className="mt-6 text-virtu-gold font-sans text-[14px] underline hover:opacity-80">
              Enviar novo contato
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h3 className="font-sans font-semibold text-[22px] text-virtu-dark mb-6">{title}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block font-sans font-semibold text-[16px] text-virtu-dark tracking-[-0.16px] mb-1.5">
                  Nome<span className="text-virtu-gold">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nome completo"
                  className={`${inputBase} ${errors.nome ? 'border-red-400 focus:ring-red-200' : ''}`}
                  {...register('nome', { required: 'Nome é obrigatório' })}
                />
                {errors.nome && <p className="text-red-500 text-[12px] mt-1 font-sans">{errors.nome.message}</p>}
              </div>
              <div>
                <label className="block font-sans font-semibold text-[16px] text-virtu-dark tracking-[-0.16px] mb-1.5">
                  E-mail<span className="text-virtu-gold">*</span>
                </label>
                <input
                  type="email"
                  placeholder="E-mail"
                  className={`${inputBase} ${errors.email ? 'border-red-400 focus:ring-red-200' : ''}`}
                  {...register('email', { required: 'E-mail é obrigatório', pattern: { value: /^\S+@\S+$/i, message: 'E-mail inválido' } })}
                />
                {errors.email && <p className="text-red-500 text-[12px] mt-1 font-sans">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block font-sans font-semibold text-[16px] text-virtu-dark tracking-[-0.16px] mb-1.5">
                  Telefone<span className="text-virtu-gold">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Telefone com DDD"
                  className={`${inputBase} ${errors.telefone ? 'border-red-400 focus:ring-red-200' : ''}`}
                  {...register('telefone', { required: 'Telefone é obrigatório' })}
                />
                {errors.telefone && <p className="text-red-500 text-[12px] mt-1 font-sans">{errors.telefone.message}</p>}
              </div>
              {submitError && <p className="text-red-500 text-[14px] text-center font-sans">{submitError}</p>}
              {/* Botão - Figma: gradient, rounded-[38.176px] */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-[38.176px] font-sans font-light text-[16px] text-white bg-gradient-to-r from-virtu-green to-virtu-gold hover:opacity-90 transition-opacity disabled:opacity-60 mt-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  'Fale com um especialista'
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
