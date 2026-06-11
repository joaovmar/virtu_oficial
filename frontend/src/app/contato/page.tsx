'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Clock, ChevronDown } from 'lucide-react';
import { getConfiguracoes, ConfiguracaoSite } from '@/lib/api';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';

interface CampoCategoria {
  label: string;
  tipo: 'texto' | 'textarea' | 'email' | 'telefone' | 'select' | 'checkbox';
  placeholder: string;
  obrigatorio: boolean;
  opcoes: string[];
}

interface Categoria {
  id: number;
  nome: string;
  slug: string;
  campos: CampoCategoria[];
}

interface ContatoPageData {
  hero_titulo: string;
  hero_subtitulo: string;
  hero_imagem: { url: string } | null;
  form_titulo: string;
  secao_titulo: string;
  horario_semana: string;
  horario_fim_semana: string;
}

export default function ContatoPage() {
  const [config, setConfig] = useState<ConfiguracaoSite | null>(null);
  const [pageData, setPageData] = useState<ContatoPageData | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState<Categoria | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { register, handleSubmit, reset, watch } = useForm<Record<string, string>>();

  useEffect(() => {
    async function f() {
      try {
        const [cfg, pd, cats] = await Promise.all([
          getConfiguracoes(),
          api.get('/contato/').then(r => r.data).catch(() => null),
          api.get('/contato/categorias/').then(r => r.data).catch(() => []),
        ]);
        setConfig(cfg);
        setPageData(pd);
        const lista = Array.isArray(cats) ? cats : [];
        setCategorias(lista);
        if (lista.length > 0) setCategoriaAtiva(lista[0]);
      } catch {}
    }
    f();
  }, []);

  const onSubmit = async (data: Record<string, string>) => {
    setIsSubmitting(true); setSubmitError('');
    try {
      const { nome, email, telefone, ...resto } = data;
      await api.post('/contato/formulario/', {
        categoria_id: categoriaAtiva?.id,
        nome,
        email,
        telefone: telefone || '',
        dados: resto,
      });
      setSubmitSuccess(true);
      reset();
    } catch {
      setSubmitError('Erro ao enviar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const bgUrl = pageData?.hero_imagem?.url || '/hero-bg.jpg';
  const heroTitulo = pageData?.hero_titulo || 'Fale Conosco';
  const heroSubtitulo = pageData?.hero_subtitulo || '';
  const horarioSemana = pageData?.horario_semana || '';
  const horarioFimSemana = pageData?.horario_fim_semana || '';
  const formTitulo = pageData?.form_titulo || 'Envie sua mensagem';

  const inputCls = 'w-full px-4 py-2.5 border border-virtu-gold/60 rounded-[16px] font-sans font-semibold text-[13px] text-virtu-dark placeholder:text-virtu-placeholder tracking-tight focus:outline-none focus:ring-2 focus:ring-virtu-gold/40';

  const renderCampo = (campo: CampoCategoria, idx: number) => {
    const name = `campo_${idx}`;
    const rules = campo.obrigatorio ? { required: true } : {};

    switch (campo.tipo) {
      case 'textarea':
        return (
          <div key={idx}>
            <label className="block font-sans font-semibold text-[12px] text-virtu-dark mb-1">
              {campo.label}{campo.obrigatorio && <span className="text-virtu-gold">*</span>}
            </label>
            <textarea placeholder={campo.placeholder} rows={3}
              className={`${inputCls} resize-none`}
              {...register(name, rules)} />
          </div>
        );
      case 'select':
        return (
          <div key={idx}>
            <label className="block font-sans font-semibold text-[12px] text-virtu-dark mb-1">
              {campo.label}{campo.obrigatorio && <span className="text-virtu-gold">*</span>}
            </label>
            <div className="relative">
              <select className={`${inputCls} appearance-none pr-8`} {...register(name, rules)}>
                <option value="">Selecione...</option>
                {campo.opcoes.map((op, i) => <option key={i} value={op}>{op}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-virtu-muted pointer-events-none" />
            </div>
          </div>
        );
      case 'checkbox':
        return (
          <div key={idx} className="flex items-center gap-2">
            <input type="checkbox" id={name} className="w-4 h-4 accent-virtu-green" {...register(name, rules)} />
            <label htmlFor={name} className="font-sans text-[13px] text-virtu-dark cursor-pointer">
              {campo.label}{campo.obrigatorio && <span className="text-virtu-gold ml-0.5">*</span>}
            </label>
          </div>
        );
      default:
        return (
          <div key={idx}>
            <label className="block font-sans font-semibold text-[12px] text-virtu-dark mb-1">
              {campo.label}{campo.obrigatorio && <span className="text-virtu-gold">*</span>}
            </label>
            <input
              type={campo.tipo === 'email' ? 'email' : campo.tipo === 'telefone' ? 'tel' : 'text'}
              placeholder={campo.placeholder}
              className={inputCls}
              {...register(name, rules)}
            />
          </div>
        );
    }
  };

  return (
    <>
      {/* Hero */}
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

            {/* Esquerda: info + horários */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="font-sans font-extralight text-[22px] md:text-[28px] text-virtu-dark mb-6 md:mb-8">
                Vamos conversar sobre o seu{' '}
                <span className="font-display italic text-virtu-gold font-medium">futuro!</span>
              </h2>
              <div className="space-y-4 md:space-y-6">
                {config?.email && (
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-virtu-bg flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-virtu-gold" />
                    </div>
                    <div>
                      <h3 className="font-sans font-semibold text-virtu-dark text-[13px] mb-0.5">E-mail</h3>
                      <a href={`mailto:${config.email}`} className="text-virtu-muted text-[13px] font-sans hover:text-virtu-green transition-colors">{config.email}</a>
                    </div>
                  </div>
                )}
                {config?.telefone && (
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-virtu-bg flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-virtu-gold" />
                    </div>
                    <div>
                      <h3 className="font-sans font-semibold text-virtu-dark text-[13px] mb-0.5">Telefone</h3>
                      <a href={`tel:${config.telefone.replace(/\D/g, '')}`} className="text-virtu-muted text-[13px] font-sans hover:text-virtu-green transition-colors">{config.telefone}</a>
                    </div>
                  </div>
                )}
              </div>
              {(horarioSemana || horarioFimSemana) && (
                <div className="mt-6 md:mt-8 p-4 md:p-5 bg-virtu-bg rounded-[14px]">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-virtu-gold" />
                    <h3 className="font-sans font-semibold text-virtu-dark text-[13px]">Horário de Atendimento</h3>
                  </div>
                  <p className="text-virtu-muted text-[12px] md:text-[13px] font-sans leading-relaxed">
                    {horarioSemana}{horarioFimSemana && <><br />{horarioFimSemana}</>}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Direita: formulário com categorias */}
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

                  {/* Seleção de categoria */}
                  {categorias.length > 0 && (
                    <div className="mb-5">
                      <label className="block font-sans font-semibold text-[12px] text-virtu-dark mb-2">
                        Tipo de contato<span className="text-virtu-gold">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {categorias.map(cat => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => { setCategoriaAtiva(cat); reset(); setSubmitError(''); }}
                            className={`px-3 py-1.5 rounded-full text-[12px] font-sans font-semibold border transition-all ${
                              categoriaAtiva?.id === cat.id
                                ? 'bg-virtu-green text-white border-virtu-green'
                                : 'bg-white text-virtu-dark border-virtu-gold/40 hover:border-virtu-green'
                            }`}
                          >
                            {cat.nome}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <form id="form-contato" onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    {/* Campos fixos: nome, email, telefone */}
                    <div>
                      <label className="block font-sans font-semibold text-[12px] text-virtu-dark mb-1">Nome<span className="text-virtu-gold">*</span></label>
                      <input type="text" placeholder="Nome completo" className={inputCls} {...register('nome', { required: true })} />
                    </div>
                    <div>
                      <label className="block font-sans font-semibold text-[12px] text-virtu-dark mb-1">E-mail<span className="text-virtu-gold">*</span></label>
                      <input type="email" placeholder="E-mail" className={inputCls} {...register('email', { required: true })} />
                    </div>
                    <div>
                      <label className="block font-sans font-semibold text-[12px] text-virtu-dark mb-1">Telefone</label>
                      <input type="tel" placeholder="Telefone com DDD" className={inputCls} {...register('telefone')} />
                    </div>

                    {/* Campos dinâmicos da categoria */}
                    <AnimatePresence mode="wait">
                      {categoriaAtiva && categoriaAtiva.campos.length > 0 && (
                        <motion.div
                          key={categoriaAtiva.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-3"
                        >
                          {categoriaAtiva.campos.map((campo, idx) => renderCampo(campo, idx))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Fallback: textarea de mensagem se não há categoria ou campos */}
                    {(!categoriaAtiva || categoriaAtiva.campos.length === 0) && (
                      <div>
                        <label className="block font-sans font-semibold text-[12px] text-virtu-dark mb-1">Mensagem<span className="text-virtu-gold">*</span></label>
                        <textarea placeholder="Mensagem" rows={3} className={`${inputCls} resize-none`} {...register('mensagem', { required: true })} />
                      </div>
                    )}

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
