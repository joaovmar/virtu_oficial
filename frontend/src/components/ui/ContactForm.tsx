'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { createLead, LeadData } from '@/lib/api';

interface ContactFormProps { title?: string; empreendimentoId?: number; className?: string; }

export default function ContactForm({ title = 'Cadastre-se e saiba mais!', empreendimentoId, className = '' }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LeadData>();

  const onSubmit = async (data: LeadData) => {
    setIsSubmitting(true); setSubmitError('');
    try { 
      await createLead({ ...data, empreendimento: empreendimentoId, pagina_origem: typeof window !== 'undefined' ? window.location.pathname : '' }); 
      setSubmitSuccess(true); 
      reset(); 
    } catch (error: any) { 
      if (error.response && error.response.status === 400) {
        setSubmitError('Dados inválidos: ' + JSON.stringify(error.response.data));
      } else {
        setSubmitError('Erro ao enviar. Tente novamente.'); 
      }
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const inputBase = 'w-full px-4 md:px-5 py-2.5 md:py-3 bg-white border border-virtu-gold rounded-full font-sans font-semibold text-xs md:text-sm text-virtu-dark placeholder:text-virtu-placeholder tracking-tight focus:outline-none focus:ring-2 focus:ring-virtu-gold/40';

  return (
    <div className={`p-5 md:p-6 ${className}`}>
      <AnimatePresence mode="wait">
        {submitSuccess ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="font-sans font-semibold text-lg text-virtu-dark mb-1">Obrigado!</h3>
            <p className="text-virtu-muted font-sans text-xs">Entraremos em contato.</p>
            <button onClick={() => setSubmitSuccess(false)} className="mt-4 text-virtu-gold font-sans text-xs underline">Enviar novo</button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h3 className="font-sans font-semibold text-base md:text-lg text-virtu-dark mb-4">{title}</h3>
            <form id="form-lead-empreendimento" onSubmit={handleSubmit(onSubmit)} className="space-y-5 md:space-y-6">
              <div>
                <label className="block font-sans font-semibold text-xs md:text-sm text-virtu-dark tracking-tight mb-1">Nome<span className="text-virtu-gold">*</span></label>
                <input type="text" placeholder="Nome completo" className={`${inputBase} ${errors.nome ? 'border-red-400' : ''}`} {...register('nome', { required: 'Obrigatório' })} />
                {errors.nome && <p className="text-red-500 text-[10px] mt-0.5">{errors.nome.message}</p>}
              </div>
              <div>
                <label className="block font-sans font-semibold text-xs md:text-sm text-virtu-dark tracking-tight mb-1">E-mail<span className="text-virtu-gold">*</span></label>
                <input type="email" placeholder="E-mail" className={`${inputBase} ${errors.email ? 'border-red-400' : ''}`} {...register('email', { required: 'Obrigatório', pattern: { value: /^\S+@\S+$/i, message: 'Inválido' } })} />
                {errors.email && <p className="text-red-500 text-[10px] mt-0.5">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block font-sans font-semibold text-xs md:text-sm text-virtu-dark tracking-tight mb-1">Telefone<span className="text-virtu-gold">*</span></label>
                <input type="tel" placeholder="Telefone com DDD" className={`${inputBase} ${errors.telefone ? 'border-red-400' : ''}`} {...register('telefone', { required: 'Obrigatório' })} />
                {errors.telefone && <p className="text-red-500 text-[10px] mt-0.5">{errors.telefone.message}</p>}
              </div>
              {submitError && <p className="text-red-500 text-xs text-center">{submitError}</p>}
              <button type="submit" disabled={isSubmitting}
                className="w-full py-2.5 md:py-3 rounded-full font-sans font-light text-xs md:text-sm text-white bg-gradient-to-r from-virtu-green to-virtu-gold hover:opacity-90 transition-opacity disabled:opacity-60 mt-1">
                {isSubmitting ? 'Enviando...' : 'Fale com um especialista'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
