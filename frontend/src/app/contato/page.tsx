'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { getConfiguracoes, ConfiguracaoSite, createLead, LeadData } from '@/lib/api';
import { useForm } from 'react-hook-form';

interface ContatoFormData extends LeadData {
  mensagem: string;
}

export default function ContatoPage() {
  const [config, setConfig] = useState<ConfiguracaoSite | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContatoFormData>();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getConfiguracoes();
        setConfig(data);
      } catch (error) {
        // Use defaults
      }
    }
    fetchData();
  }, []);

  const onSubmit = async (data: ContatoFormData) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await createLead({
        ...data,
        origem: 'contato',
        pagina_origem: '/contato',
      });
      setSubmitSuccess(true);
      reset();
    } catch (error) {
      setSubmitError('Erro ao enviar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBase =
    'w-full px-5 py-3.5 border border-gray-200 rounded-xl font-sans text-sm text-virtu-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-virtu-gold/50 focus:border-virtu-gold transition-all';

  return (
    <>
      {/* ================================================================
          HERO
          ================================================================ */}
      <section className="relative py-32 md:py-40">
        <Image src="/hero-bg.jpg" fill className="object-cover" alt="Contato" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-virtu-teal/80 to-virtu-teal-dark/70" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-sans font-bold text-3xl lg:text-4xl text-white mb-3"
          >
            Pronto para fazer parte de nossa história?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 font-sans text-base"
          >
            Converse com nossa equipe e descubra como podemos ajudar você a realizar seus sonhos.
          </motion.p>
        </div>
      </section>

      {/* ================================================================
          FORMULÁRIO + INFO
          ================================================================ */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Esquerda: Info de contato */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="font-display text-3xl text-virtu-dark mb-8">
                Vamos conversar sobre o seu <span className="text-virtu-gold italic">futuro!</span>
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-virtu-cream flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-virtu-gold" />
                  </div>
                  <div>
                    <h3 className="font-sans font-medium text-virtu-dark text-sm mb-0.5">E-mail</h3>
                    <a
                      href={`mailto:${config?.email || 'contato@virtu.com.br'}`}
                      className="text-gray-600 text-sm font-sans hover:text-virtu-gold transition-colors"
                    >
                      {config?.email || 'contato@virtu.com.br'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-virtu-cream flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-virtu-gold" />
                  </div>
                  <div>
                    <h3 className="font-sans font-medium text-virtu-dark text-sm mb-0.5">Telefone</h3>
                    <a
                      href={`tel:${(config?.telefone || '(11) 99999-9999').replace(/\D/g, '')}`}
                      className="text-gray-600 text-sm font-sans hover:text-virtu-gold transition-colors"
                    >
                      {config?.telefone || '(11) 99999-9999'}
                    </a>
                  </div>
                </div>

                {config?.endereco && (
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-virtu-cream flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-virtu-gold" />
                    </div>
                    <div>
                      <h3 className="font-sans font-medium text-virtu-dark text-sm mb-0.5">Endereço</h3>
                      <p className="text-gray-600 text-sm font-sans">{config.endereco}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Horário */}
              <div className="mt-10 p-6 bg-virtu-cream rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-virtu-gold" />
                  <h3 className="font-sans font-medium text-virtu-dark text-sm">Horário de Atendimento</h3>
                </div>
                <p className="text-gray-600 text-sm font-sans leading-relaxed">
                  Segunda a Sexta: 9h às 18h<br />
                  Sábado: 9h às 13h
                </p>
              </div>
            </motion.div>

            {/* Direita: Formulário */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {submitSuccess ? (
                <div className="bg-white rounded-2xl p-10 shadow-lg text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl text-virtu-dark mb-2">Mensagem enviada!</h3>
                  <p className="text-gray-500 font-sans text-sm mb-6">Em breve entraremos em contato.</p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="text-virtu-gold font-sans text-sm underline"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="font-sans font-bold text-xl text-virtu-dark mb-6">Envie sua mensagem</h3>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-sans font-medium text-gray-700 mb-1.5">
                        Nome<span className="text-virtu-gold">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Nome completo"
                        className={`${inputBase} ${errors.nome ? 'border-red-400' : ''}`}
                        {...register('nome', { required: 'Obrigatório' })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-sans font-medium text-gray-700 mb-1.5">
                        E-mail<span className="text-virtu-gold">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="E-mail"
                        className={`${inputBase} ${errors.email ? 'border-red-400' : ''}`}
                        {...register('email', { required: 'Obrigatório', pattern: { value: /^\S+@\S+$/i, message: 'Inválido' } })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-sans font-medium text-gray-700 mb-1.5">
                        Telefone<span className="text-virtu-gold">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="Telefone com DDD"
                        className={`${inputBase} ${errors.telefone ? 'border-red-400' : ''}`}
                        {...register('telefone', { required: 'Obrigatório' })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-sans font-medium text-gray-700 mb-1.5">
                        Mensagem<span className="text-virtu-gold">*</span>
                      </label>
                      <textarea
                        placeholder="Mensagem"
                        rows={5}
                        className={`${inputBase} !rounded-2xl resize-none ${errors.mensagem ? 'border-red-400' : ''}`}
                        {...register('mensagem', { required: 'Obrigatório' })}
                      />
                    </div>
                    {submitError && (
                      <p className="text-red-500 text-sm text-center font-sans">{submitError}</p>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl font-sans font-medium text-sm bg-virtu-gold hover:bg-virtu-gold-hover text-white transition-all shadow-md disabled:opacity-60"
                    >
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
