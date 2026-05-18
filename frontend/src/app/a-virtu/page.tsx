'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Target, Trophy, Heart } from 'lucide-react';
import { getSobreNos, SobreNosData, createLead, LeadData } from '@/lib/api';
import { useForm } from 'react-hook-form';
import VideoPlayer from '@/components/ui/VideoPlayer';

export default function SobreNosPage() {
  const [data, setData] = useState<SobreNosData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { register, handleSubmit, reset } = useForm<LeadData & { mensagem: string }>();

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSobreNos() {
      try {
        const responseData = await getSobreNos();
        if (!controller.signal.aborted) {
          setData(responseData);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('SobreNosPage: Falha ao carregar dados.', error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }
    
    fetchSobreNos();

    return () => controller.abort();
  }, []);

  const onSubmit = async (d: LeadData & { mensagem: string }) => {
    setIsSubmitting(true);
    try {
      await createLead({ ...d, origem: 'sobre_nos', pagina_origem: '/a-virtu' });
      setSubmitSuccess(true);
      reset();
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        console.error('Erro de Validação do Django (400):', error.response.data);
        alert('Por favor, verifique os campos do formulário. Alguns dados são inválidos: ' + JSON.stringify(error.response.data));
      } else {
        console.error('Falha ao enviar lead:', error);
        alert('Ocorreu um erro interno. Tente novamente mais tarde.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-virtu-gold border-t-transparent" />
      </div>
    );
  }

  const inputFlatCls = 'w-full px-4 md:px-5 py-3 md:py-3.5 rounded-lg bg-white text-virtu-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-virtu-green transition-all shadow-sm';

  return (
    <>
      {/* 1. HERO — Banner arredondado com margens */}
      <section className="relative pt-20 md:pt-24 min-h-[350px]">
        <div className="relative mx-3 sm:mx-6 md:mx-10 lg:mx-14 h-[50vh] sm:h-[55vh] md:h-[65vh] min-h-[350px] rounded-2xl md:rounded-[44px] overflow-hidden flex flex-col items-center justify-end pb-10 md:pb-14">
          <Image src={data?.hero_imagem?.url || '/hero-bg.jpg'} alt="A virtú" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-white font-sans">
            <span className="font-extralight text-2xl sm:text-3xl md:text-4xl">A </span>
            <span className="font-bold italic text-3xl sm:text-4xl md:text-5xl">virtú</span>
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-5">
            <svg width="18" height="20" viewBox="0 0 27 28" fill="none" className="animate-bounce opacity-70 mx-auto">
              <path d="M13.5 2L13.5 26M13.5 26L25 14.5M13.5 26L2 14.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
        </div>
      </section>

      {/* 2. Nosso propósito (Ajuste Pixel Perfect do OVERLAP) */}
      <section className="py-10 md:py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Aumentado o gap e o tamanho da coluna da esquerda para evitar que a fonte 8xl vaze pro lado */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-start">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:w-[420px] shrink-0 text-center lg:text-left">
              <p className="font-sans font-extralight text-xl md:text-2xl lg:text-3xl text-virtu-dark leading-none">Nosso</p>
              <p className="font-display font-medium italic text-6xl md:text-7xl lg:text-8xl text-virtu-gold leading-[0.85] -mt-1 pr-4">propósito</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex-1 mt-2 lg:mt-0">
              <div className="font-sans font-light text-sm md:text-[15px] lg:text-base text-virtu-dark leading-relaxed md:leading-[1.8] tracking-tight [&_p]:mb-5"
                dangerouslySetInnerHTML={{ __html: data?.historia_texto || '<p>A virtú nasce da união de profissionais com mais de duas décadas de atuação na construção civil, sustentada por parcerias sólidas e por uma trajetória marcada pela excelência.</p><p>Somos uma incorporadora e urbanizadora dedicada ao segmento de médio e alto padrão, com projetos que unem funcionalidade, elegância e exclusividade.</p>' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Vídeo */}
      <section className="py-10 md:py-12 lg:py-16 bg-white">
        <div className="mx-3 sm:mx-6 md:mx-10 lg:mx-20 xl:mx-28">
          <VideoPlayer
            videoId={data?.video_url?.includes('youtube') ? (data.video_url.split('v=')[1]?.split('&')[0] || '') : (data?.video_url || '')}
            title={data?.video_titulo || 'vídeo institucional virtú'}
            thumbnailUrl={data?.video_thumbnail?.url || '/video-thumb.jpg'}
          />
        </div>
      </section>

      {/* 4. Missão / Visão / Valores */}
      <section className={`py-10 md:py-14 lg:py-20 relative overflow-hidden ${
        data?.mvv_background ? 'bg-virtu-green-dark' : 'bg-[#f5f6f4]'
      }`}>
        {/* Background: apenas imagem cadastrada no backoffice, sem SVG decorativo padrão */}
        {data?.mvv_background && (
          <div className="absolute inset-0 pointer-events-none">
            <Image src={data.mvv_background.url} alt="" fill className="object-cover" />
            <div className="absolute inset-0 bg-virtu-green-dark/70" />
          </div>
        )}

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-16">
            {[
              { icon: Target, apiIcon: data?.missao_icone, title: data?.missao_titulo || 'missão', apiText: data?.missao_texto, fallback: 'Construir e expandir um legado com <strong>propósito</strong>, oferecendo produtos que acompanhem a evolução dos nossos clientes.' },
              { icon: Trophy, apiIcon: data?.visao_icone, title: data?.visao_titulo || 'visão', apiText: data?.visao_texto, fallback: 'Construir, junto aos nossos clientes, um futuro <strong>sólido e virtuoso</strong>, com excelência e <strong>propósito</strong> em cada conquista.' },
              { icon: Heart, apiIcon: data?.valores_icone, title: data?.valores_titulo || 'valores', apiText: data?.valores_texto, fallback: '<strong>Humildade</strong>, <strong>disciplina e ética</strong> como pilares; <strong>Excelência</strong>, como caminho para inovação.' },
            ].map(({ icon: Icon, apiIcon, title, apiText, fallback }, i) => {
              const hasBg = !!data?.mvv_background;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-3 md:mb-5 overflow-hidden ${
                    hasBg
                      ? 'bg-white/10 border border-white/20'
                      : 'bg-virtu-green/10 border border-virtu-green/20'
                  }`}>
                    {apiIcon ? (
                      <Image src={apiIcon.url} alt={title} width={40} height={40} className="w-8 h-8 md:w-10 md:h-10 object-contain" />
                    ) : (
                      <Icon className={`w-8 h-8 md:w-10 md:h-10 ${hasBg ? 'text-white' : 'text-virtu-green-dark'}`} strokeWidth={1.2} />
                    )}
                  </div>
                  <h3 className={`font-sans font-semibold text-sm md:text-base tracking-tight mb-2 md:mb-3 ${
                    hasBg ? 'text-white' : 'text-virtu-green-dark'
                  }`}>{title}</h3>
                  <div className={`font-sans font-extralight text-[11px] md:text-[13px] text-center tracking-tight leading-relaxed max-w-[320px] [&_strong]:font-semibold ${
                    hasBg ? 'text-white/90' : 'text-virtu-text'
                  }`}
                    dangerouslySetInnerHTML={{ __html: apiText || fallback }} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Política de qualidade */}
      <section className="py-10 md:py-14 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
          <h2 className="font-sans font-semibold text-lg md:text-2xl text-virtu-green tracking-tight mb-3 md:mb-5">Política de qualidade</h2>
          <div className="font-sans font-extralight text-sm md:text-base text-virtu-dark leading-relaxed tracking-tight max-w-4xl [&_p]:mb-3"
            dangerouslySetInnerHTML={{ __html: data?.politica_texto || '<p>A virtú busca respeitar o atendimento aos requisitos aplicáveis, com melhoria contínua.</p>' }} />
          <div className="mt-8 md:mt-12">
            <h3 className="font-sans font-semibold text-base md:text-xl text-virtu-green tracking-tight mb-4 md:mb-6">Garantia e qualidade</h3>
            <div className="flex gap-6 md:gap-10 items-center flex-wrap">
              <Image src="/pbqp-h.png" alt="PBQP-H" width={200} height={90} className="object-contain h-[45px] md:h-[70px] w-auto" />
              <Image src="/iso9001.png" alt="ISO 9001" width={150} height={60} className="object-contain h-[35px] md:h-[50px] w-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA com form refatorado (Ajuste de Largura e GPTW) */}
      <section className="relative w-full min-h-[75vh] flex items-center justify-center py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <Image 
          src={data?.cta_imagem?.url || '/hero-bg.jpg'} 
          fill 
          className="object-cover object-center z-0" 
          alt="Trabalhe Conosco" 
          quality={85}
        />
        
        <div className="absolute inset-0 bg-black/60 z-0" />

        {/* Selo Great Place To Work Movido para a esquerda */}
        <div className="absolute top-6 right-6 md:top-10 md:right-16 lg:top-12 lg:right-24 z-20 transition-all">
          <Image
            src="/selo-gptw.png" 
            alt="Certificada Great Place To Work"
            width={90}
            height={135}
            className="w-16 md:w-20 lg:w-[90px] h-auto drop-shadow-lg"
          />
        </div>

        {/* Largura aumentada para max-w-4xl (Área vermelha) */}
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
          
          <div className="text-center mb-10 w-full">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight"
            >
              {data?.cta_titulo || 'Pronto para fazer parte de nossa história?'}
            </motion.h2>
            <p className="text-sm md:text-base text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
              {data?.cta_subtitulo || 'Converse com nossa equipe e descubra como podemos ajudar você a realizar seus sonhos. Aqui nós trabalhamos para ajudar você a alcançar um propósito para seu futuro que você nunca viu antes!'}
              <br className="hidden md:block" />
              <span className="italic mt-3 block opacity-80 text-sm md:text-[15px]">
                Aqui nós trabalhamos para ajudar você a alcançar um propósito para seu futuro!
              </span>
            </p>
          </div>

          {submitSuccess ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl text-center w-full max-w-2xl shadow-xl">
              <p className="text-white font-bold text-2xl mb-2">Mensagem enviada com sucesso!</p>
              <p className="text-white/80 text-lg">Em breve nossa equipe entrará em contato com você.</p>
            </motion.div>
          ) : (
            // Formulário esticado para max-w-3xl para preencher as margens corretas
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-6 max-w-3xl">
              
              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="nome" className="text-white text-[15px] font-semibold tracking-wide">Nome*</label>
                <input 
                  id="nome"
                  type="text" 
                  placeholder="Nome completo" 
                  className={inputFlatCls} 
                  {...register('nome', { required: true })} 
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="email" className="text-white text-[15px] font-semibold tracking-wide">E-mail*</label>
                <input 
                  id="email"
                  type="email" 
                  placeholder="E-mail" 
                  className={inputFlatCls} 
                  {...register('email', { required: true })} 
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="telefone" className="text-white text-[15px] font-semibold tracking-wide">Telefone*</label>
                <input 
                  id="telefone"
                  type="tel" 
                  placeholder="(11) 99999-9999" 
                  className={inputFlatCls} 
                  {...register('telefone', { required: true })} 
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="mensagem" className="text-white text-[15px] font-semibold tracking-wide">Mensagem*</label>
                <textarea 
                  id="mensagem"
                  placeholder="Mensagem" 
                  rows={4} 
                  className={`${inputFlatCls} resize-none`} 
                  {...register('mensagem', { required: true })} 
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`mt-6 mx-auto w-full md:w-auto md:min-w-[240px] px-10 py-3.5 rounded-full text-white font-semibold text-[15px] transition-all shadow-md ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed opacity-70' 
                    : 'bg-gradient-to-r from-virtu-green to-virtu-gold hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                {isSubmitting ? 'Enviando...' : 'Entrar em contato'}
              </button>

            </form>
          )}
        </div>
      </section>
    </>
  );
}