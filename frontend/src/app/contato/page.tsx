'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { getConfiguracoes, ConfiguracaoSite, createLead, LeadData } from '@/lib/api';
import { useForm } from 'react-hook-form';

interface ContatoFormData extends LeadData { mensagem: string; }

export default function ContatoPage() {
  const [config, setConfig] = useState<ConfiguracaoSite | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContatoFormData>();

  useEffect(() => { async function f() { try { const d = await getConfiguracoes(); setConfig(d); } catch {} } f(); }, []);

  const onSubmit = async (data: ContatoFormData) => {
    setIsSubmitting(true); setSubmitError('');
    try { 
      await createLead({ ...data, origem: 'contato', pagina_origem: '/contato' }); 
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

  const inputCls = 'w-full px-5 py-3 md:py-3.5 border border-virtu-gold rounded-[20px] font-sans font-semibold text-[14px] md:text-[16px] text-virtu-dark placeholder:text-virtu-placeholder tracking-[-0.16px] focus:outline-none focus:ring-2 focus:ring-virtu-gold/40';

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 sm:py-24 md:py-28 lg:py-32">
        <Image src="/hero-bg.jpg" fill className="object-cover" alt="Contato" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-virtu-green-dark/80 to-virtu-green-dark/70" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-sans font-bold text-[24px] sm:text-[30px] lg:text-[36px] text-white mb-2 md:mb-3 leading-snug">
            Pronto para fazer parte de nossa história?
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-white/80 font-sans font-light text-[13px] md:text-[16px]">
            Converse com nossa equipe e descubra como podemos ajudar você.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16">
            {/* Info */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="font-sans font-extralight text-[24px] md:text-[30px] text-virtu-dark mb-6 md:mb-8">
                Vamos conversar sobre o seu <span className="font-display italic text-virtu-gold font-medium">futuro!</span>
              </h2>
              <div className="space-y-4 md:space-y-6">
                {[
                  { icon: Mail, label: 'E-mail', value: config?.email || 'contato@virtu.com.br', href: `mailto:${config?.email || 'contato@virtu.com.br'}` },
                  { icon: Phone, label: 'Telefone', value: config?.telefone || '(11) 99999-9999', href: `tel:${(config?.telefone || '11999999999').replace(/\D/g, '')}` },
                ].map(({ icon: Icon, label, value, href }, i) => (
                  <div key={i} className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-virtu-bg flex items-center justify-center shrink-0"><Icon className="w-4 h-4 md:w-5 md:h-5 text-virtu-gold" /></div>
                    <div>
                      <h3 className="font-sans font-semibold text-virtu-dark text-[13px] md:text-[15px] mb-0.5">{label}</h3>
                      <a href={href} className="text-virtu-muted text-[13px] md:text-[15px] font-sans hover:text-virtu-green transition-colors">{value}</a>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 md:mt-10 p-5 md:p-6 bg-virtu-bg rounded-[16px] md:rounded-[20px]">
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-virtu-gold" />
                  <h3 className="font-sans font-semibold text-virtu-dark text-[13px] md:text-[15px]">Horário de Atendimento</h3>
                </div>
                <p className="text-virtu-muted text-[12px] md:text-[14px] font-sans leading-relaxed">Segunda a Sexta: 9h às 18h<br />Sábado: 9h às 13h</p>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              {submitSuccess ? (
                <div className="bg-white rounded-[20px] p-8 md:p-10 shadow-lg text-center">
                  <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="font-sans font-semibold text-[22px] text-virtu-dark mb-2">Mensagem enviada!</h3>
                  <p className="text-virtu-muted font-sans text-[14px] mb-4">Em breve entraremos em contato.</p>
                  <button onClick={() => setSubmitSuccess(false)} className="text-virtu-gold font-sans text-[14px] underline">Enviar outra</button>
                </div>
              ) : (
                <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-lg">
                  <h3 className="font-sans font-semibold text-[18px] md:text-[22px] text-virtu-dark mb-5 md:mb-6">Envie sua mensagem</h3>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 md:space-y-4">
                    {[
                      { name: 'nome' as const, label: 'Nome', type: 'text', placeholder: 'Nome completo' },
                      { name: 'email' as const, label: 'E-mail', type: 'email', placeholder: 'E-mail' },
                      { name: 'telefone' as const, label: 'Telefone', type: 'tel', placeholder: 'Telefone com DDD' },
                    ].map(({ name, label, type, placeholder }) => (
                      <div key={name}>
                        <label className="block font-sans font-semibold text-[13px] md:text-[15px] text-virtu-dark mb-1 md:mb-1.5">{label}<span className="text-virtu-gold">*</span></label>
                        <input type={type} placeholder={placeholder} className={`${inputCls} ${errors[name] ? 'border-red-400' : ''}`} {...register(name, { required: true })} />
                      </div>
                    ))}
                    <div>
                      <label className="block font-sans font-semibold text-[13px] md:text-[15px] text-virtu-dark mb-1 md:mb-1.5">Mensagem<span className="text-virtu-gold">*</span></label>
                      <textarea placeholder="Mensagem" rows={4} className={`${inputCls} resize-none`} {...register('mensagem', { required: true })} />
                    </div>
                    {submitError && <p className="text-red-500 text-[13px] text-center font-sans">{submitError}</p>}
                    <button type="submit" disabled={isSubmitting}
                      className="w-full py-3 md:py-3.5 rounded-[38.176px] font-sans font-light text-[14px] md:text-[16px] text-white bg-gradient-to-r from-virtu-green to-virtu-gold hover:opacity-90 transition-opacity disabled:opacity-60">
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
