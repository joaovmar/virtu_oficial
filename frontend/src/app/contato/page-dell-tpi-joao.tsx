'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Phone, Clock } from 'lucide-react';
import { getConfiguracoes, ConfiguracaoSite, createLead, LeadData } from '@/lib/api';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';

interface ContatoPageData {
  hero_titulo: string;
  hero_subtitulo: string;
  hero_imagem: { url: string } | null;
  form_titulo: string;
  secao_titulo: string;
  horario_semana: string;
  horario_fim_semana: string;
}

interface ContatoFormData extends LeadData { mensagem: string; }

export default function ContatoPage() {
  const [config, setConfig] = useState<ConfiguracaoSite | null>(null);
  const [pageData, setPageData] = useState<ContatoPageData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContatoFormData>();

  useEffect(() => {
    async function f() {
      try {
        const [cfg, pd] = await Promise.all([
          getConfiguracoes(),
          api.get('/contato/').then(r => r.data).catch(() => null),
        ]);
        setConfig(cfg);
        setPageData(pd);
      } catch {}
    }
    f();
  }, []);

  const onSubmit = async (data: ContatoFormData) => {
    setIsSubmitting(true); setSubmitError('');
    try {
      await createLead({ ...data, origem: 'contato', pagina_origem: '/contato' });
      setSubmitSuccess(true);
      reset();
    } catch (error: any) {
      setSubmitError('Erro ao enviar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const bgUrl = pageData?.hero_imagem?.url || '/hero-bg.jpg';
  const heroTitulo = pageData?.hero_titulo || 'Fale Conosco';
  const heroSubtitulo = pageData?.hero_subtitulo || 'Converse com nossa equipe e descubra como podemos ajudar você.';
  const secaoTitulo = pageData?.secao_titulo || 'Vamos conversar sobre o seu futuro!';
  const horarioSemana = pageData?.horario_semana || 'Segunda a Sexta: 9h às 18h';
  const horarioFimSemana = pageData?.horario_fim_semana || 'Sábado: 9h às 13h';
  const formTitulo = pageData?.form_titulo || 'Envie sua mensagem';

  const inputCls = 'w-full px-4 py-2.5 border border-virtu-gold/60 rounded-[16px] font-sans font-semibold text-[13px] text-virtu-dark placeholder:text-virtu-placeholder tracking-tight focus:outline-none focus:ring-2 focus:ring-virtu-gold/40';

  return (
    <>
      {/* Hero — banner maior */}
      <section className="relative" style={{ height: 'clamp(280px, 42vh, 460px)' }}>
        <Image src={bgUrl} fill className="object-cover" alt={heroTitulo} priority />
        <div className="absolute inset-0 bg-gradient-to-r from-virtu-green-dark/85 to-virtu-green-dark/70" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 text-center pt-20 md:pt-24">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-sans font-bold text-[24px] sm:text-[28px] md:text-[32px] text-white mb-2 leading-snug">
            {heroTitulo}
          </motion.h1>
          {heroSubtitulo && (
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-white/80 font-sans font-light text-[13px] md:text-[15px] max-w-lg">
              {heroSubtitulo}
            </motion.p>
          )}
        </div>
      </section>

      {/* Conteúdo */}
      <section className="py-10 md:py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16">

            {/* Info */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="font-sans font-extralight text-[22px] md:text-[28px] text-virtu-dark mb-6 md:mb-8">
                Vamos conversar sobre o seu{' '}
                <span className="font-display italic text-virtu-gold font-medium">futuro!</span>
              </h2>
              <div className="space-y-4 md:space-y-6">
                {[
                  { icon: Mail, label: 'E-mail', value: config?.email || 'contato@virtu.com.br', href: `mailto:${config?.email || 'contato@virtu.com.br'}` },
                  { icon: Phone, label: 'Telefone', value: config?.telefone || '(11) 99999-9999', href: `tel:${(config?.telefone || '11999999999').replace(/\D/g, '')}` },
                ].map(({ icon: Icon, label, value, href }, i) => (
                  <div key={i} className="flex items-start gap-3 md:gap-4">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-virtu-bg flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-virtu-gold" />
                    </div>
                    <div>
                      <h3 className="font-sans font-semibold text-virtu-dark text-[13px] mb-0.5">{label}</h3>
                      <a href={href} className="text-virtu-muted text-[13px] font-sans hover:text-virtu-green transition-colors">{value}</a>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 md:mt-8 p-4 md:p-5 bg-virtu-bg rounded-[14px]">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-virtu-gold" />
                  <h3 className="font-sans font-semibold text-virtu-dark text-[13px]">Horário de Atendimento</h3>
                </div>
                <p className="text-virtu-muted text-[12px] md:text-[13px] font-sans leading-relaxed">
                  {horarioSemana}<br />{horarioFimSemana}
                </p>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              {submitSuccess ? (
                <div className="bg-white rounded-[16px] p-6 md:p-8 shadow-lg text-center">
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="font-sans font-semibold text-[20px] text-virtu-dark mb-2">Mensagem enviada!</h3>
                  <p className="text-virtu-muted font-sans text-[13px] mb-4">Em breve entraremos em contato.</p>
                  <button onClick={() => setSubmitSuccess(false)} className="text-virtu-gold font-sans text-[13px] underline">Enviar outra</button>
                </div>
              ) : (
                <div className="bg-white rounded-[16px] p-5 md:p-7 shadow-lg">
                  <h3 className="font-sans font-semibold text-[16px] md:text-[20px] text-virtu-dark mb-4">{formTitulo}</h3>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    {[
                      { name: 'nome' as const, label: 'Nome', type: 'text', placeholder: 'Nome completo' },
                      { name: 'email' as const, label: 'E-mail', type: 'email', placeholder: 'E-mail' },
                      { name: 'telefone' as const, label: 'Telefone', type: 'tel', placeholder: 'Telefone com DDD' },
                    ].map(({ name, label, type, placeholder }) => (
                      <div key={name}>
                        <label className="block font-sans font-semibold text-[12px] text-virtu-dark mb-1">
                          {label}<span className="text-virtu-gold">*</span>
                        </label>
                        <input type={type} placeholder={placeholder}
                          className={`${inputCls} ${errors[name] ? 'border-red-400' : ''}`}
                          {...register(name, { required: true })} />
                      </div>
                    ))}
                    <div>
                      <label className="block font-sans font-semibold text-[12px] text-virtu-dark mb-1">
                        Mensagem<span className="text-virtu-gold">*</span>
                      </label>
                      <textarea placeholder="Mensagem" rows={3}
                        className={`${inputCls} resize-none`}
                        {...register('mensagem', { required: true })} />
                    </div>
                    {submitError && <p className="text-red-500 text-[12px] text-center font-sans">{submitError}</p>}
                    <button type="submit" disabled={isSubmitting}
                      className="w-full py-2.5 rounded-[30px] font-sans font-light text-[13px] text-white bg-gradient-to-r from-virtu-green to-virtu-gold hover:opacity-90 transition-opacity disabled:opacity-60 mt-1">
                      {isSubmitting ? 'Enviando...' : 'Entrar em contato'}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
}
