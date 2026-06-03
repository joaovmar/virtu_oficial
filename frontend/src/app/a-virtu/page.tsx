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

  const inputFlatCls = 'w-full px-4 py-2.5 rounded-lg bg-white text-virtu-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-virtu-green transition-all shadow-sm text-sm';

  return (
    <>
      {/* 1. HERO — Banner maior */}
      <section className="relative pt-20 md:pt-24 min-h-[350px]">
        <div className="relative mx-3 sm:mx-6 md:mx-10 lg:mx-14 h-[60vh] sm:h-[65vh] md:h-[75vh] min-h-[400px] rounded-2xl md:rounded-[44px] overflow-hidden flex flex-col items-center justify-end pb-10 md:pb-14">
          <Image src={data?.hero_imagem?.url || '/hero-bg.jpg'} alt="A virtú" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-white font-sans">
            <span className="font-extralight text-2xl sm:text-3xl md:text-4xl">A </span>
            <span className="font-bold italic text-3xl sm:text-4xl md:text-5xl">virtú</span>
          </motion.h1>
        {/* V menor no hero */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-5">
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="opacity-80 mx-auto w-fit">
              <svg width="28" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#vclip2)">
                  <path d="M13.5465 18.9383C13.5235 18.9383 13.4944 18.932 13.4714 18.932C11.6212 18.9081 10.2098 17.3722 9.03433 16.1953C7.67426 14.8325 6.29735 13.3085 4.9143 11.6296C4.90818 11.624 4.90282 11.6177 4.90282 11.6113L8.44084 11.6113C9.21889 12.4722 10.072 13.3561 10.677 13.8882C11.8004 14.8865 12.5157 15.5313 13.5005 15.5258C14.9127 15.5139 15.9725 14.2472 17.6382 12.257C17.8227 12.0362 17.9958 11.821 18.1566 11.6113L21.8447 11.6113C21.2681 12.3221 20.6746 13.0218 20.0987 13.727C19.4301 14.5458 18.7616 15.3582 18.093 16.1714C16.756 17.8027 15.1883 18.9383 13.5465 18.9383Z" fill="#C1A784"/>
                  <path d="M1.29541e-06 13.9996C1.63283e-06 6.28029 6.05676 2.64749e-07 13.5004 5.90121e-07C20.944 9.15492e-07 27 6.28029 27 13.9996C27 21.7189 20.944 27.9992 13.5004 27.9992C6.05676 27.9992 0.000767712 21.7189 0.00076805 13.9996L1.29541e-06 13.9996ZM25.0281 13.9996C25.0281 7.40801 19.8566 2.04498 13.5004 2.04498C7.1442 2.04498 1.97195 7.408 1.97195 14.0004C1.97195 20.5928 7.14343 25.9558 13.5004 25.9558C19.8573 25.9558 25.0281 20.592 25.0281 13.9996Z" fill="#C1A784"/>
                </g>
                <defs>
                  <clipPath id="vclip2">
                    <rect width="28" height="27" fill="white" transform="translate(27 1.18021e-06) rotate(90)"/>
                  </clipPath>
                </defs>
              </svg>
            </motion.div>
          </motion.div>
        </div>
        </div>
      </section>

      {/* 2. Nosso propósito */}
      <section className="py-14 md:py-20 lg:py-28 bg-white min-h-screen flex items-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65 }}
            className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center"
          >
            {/* Esquerda: Nosso (cima) + propósito (baixo) */}
            <div className="shrink-0 lg:w-[220px] text-left">
              <p className="font-sans font-extralight text-2xl md:text-3xl text-virtu-dark leading-none">
                Nosso
              </p>
              <p className="font-display font-medium italic text-4xl md:text-5xl lg:text-6xl text-virtu-gold leading-tight">
                propósito
              </p>
            </div>
            {/* Direita: texto */}
            <div
              className="flex-1 font-sans font-light text-[14px] md:text-[15px] lg:text-[16px] text-virtu-dark leading-relaxed md:leading-[1.9] tracking-tight [&_p]:mb-5"
              dangerouslySetInnerHTML={{ __html: data?.historia_texto || '<p>A virtú nasce da união de profissionais com mais de duas décadas de atuação na construção civil, sustentada por parcerias sólidas e por uma trajetória marcada pela excelência.</p><p>Somos uma incorporadora e urbanizadora dedicada ao segmento de médio e alto padrão, com projetos que unem funcionalidade, elegância e exclusividade.</p>' }}
            />
          </motion.div>
        </div>
      </section>

      {/* 3. Vídeo */}
      <section className="py-10 md:py-12 lg:py-16 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65 }}
          className="max-w-5xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16"
        >
          <VideoPlayer
            videoId={data?.video_url?.includes('youtube.com')
              ? (data.video_url.split('v=')[1]?.split('&')[0] || '')
              : data?.video_url?.includes('youtu.be')
                ? (data.video_url.split('youtu.be/')[1]?.split('?')[0] || '')
                : (data?.video_url || '')}
            title={data?.video_titulo || 'vídeo institucional virtú'}
            thumbnailUrl={data?.video_thumbnail?.url || '/video-thumb.jpg'}
          />
        </motion.div>
      </section>

      {/* 4. Missão / Visão / Valores — altura ampliada */}
      <section className="min-h-[80vh] py-20 md:py-28 lg:py-36 relative overflow-hidden flex items-center bg-virtu-green-dark">
        {/* Background: apenas imagem do backoffice — sem overlay extra */}
        {data?.mvv_background && (
          <div className="absolute inset-0 pointer-events-none">
            <Image src={data.mvv_background.url} alt="" fill className="object-cover" />
            {/* overlay leve apenas para garantir legibilidade do texto */}
            <div className="absolute inset-0 bg-virtu-green-dark/50" />
          </div>
        )}

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10 w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-14 lg:gap-20"
          >
            {[
              { icon: Target, apiIcon: data?.missao_icone, title: data?.missao_titulo || 'missão', apiText: data?.missao_texto, fallback: 'Construir e expandir um legado com <strong>propósito</strong>, oferecendo produtos que acompanhem a evolução dos nossos clientes.' },
              { icon: Trophy, apiIcon: data?.visao_icone, title: data?.visao_titulo || 'visão', apiText: data?.visao_texto, fallback: 'Construir, junto aos nossos clientes, um futuro <strong>sólido e virtuoso</strong>, com excelência e <strong>propósito</strong> em cada conquista.' },
              { icon: Heart, apiIcon: data?.valores_icone, title: data?.valores_titulo || 'valores', apiText: data?.valores_texto, fallback: '<strong>Humildade</strong>, <strong>disciplina e ética</strong> como pilares; <strong>Excelência</strong>, como caminho para inovação.' },
            ].map(({ icon: Icon, apiIcon, title, apiText, fallback }, i) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
                className="flex flex-col items-center text-center"
              >
                {/* Círculo com gradiente do Figma: #348981 → #C1A784 */}
                <div
                  className="w-20 h-20 md:w-24 md:h-24 lg:w-[93px] lg:h-[93px] rounded-full flex items-center justify-center mb-5 md:mb-7 flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #348981 0%, #C1A784 100%)' }}
                >
                  {apiIcon ? (
                    <Image src={apiIcon.url} alt={title} width={48} height={48}
                      className="w-10 h-10 md:w-11 md:h-11 object-contain" />
                  ) : (
                    <Icon className="w-9 h-9 md:w-10 md:h-10 text-white" strokeWidth={1.2} />
                  )}
                </div>
                <h3 className="font-sans font-semibold text-base md:text-lg lg:text-xl text-white tracking-tight mb-3 md:mb-4">
                  {title}
                </h3>
                <div
                  className="font-sans font-extralight text-[13px] md:text-[14px] text-white/85 text-center tracking-tight leading-relaxed max-w-[300px] lg:max-w-[340px] [&_strong]:font-semibold [&_strong]:text-white"
                  dangerouslySetInnerHTML={{ __html: apiText || fallback }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. Política de qualidade */}
      <section className="py-10 md:py-14 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="font-sans font-semibold text-lg md:text-2xl text-virtu-green tracking-tight mb-3 md:mb-5">Política de qualidade</h2>
            <div className="font-sans font-extralight text-sm md:text-base text-virtu-dark leading-relaxed tracking-tight max-w-4xl [&_p]:mb-3"
              dangerouslySetInnerHTML={{ __html: data?.politica_texto || '<p>A virtú busca respeitar o atendimento aos requisitos aplicáveis, com melhoria contínua.</p>' }} />
            <div className="mt-8 md:mt-12">
              <h3 className="font-sans font-semibold text-base md:text-xl text-virtu-green tracking-tight mb-4 md:mb-6">Garantia e qualidade</h3>
              <div className="flex gap-6 md:gap-10 items-center flex-wrap">
                {/* Selos dinâmicos do Wagtail — cadastrados em A Virtú > Selos de Qualidade */}
                {data?.selos_qualidade && data.selos_qualidade.length > 0 ? (
                  data.selos_qualidade.map((selo: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                      {selo.imagem?.url && (
                        <Image
                          src={selo.imagem.url}
                          alt={selo.nome || 'Selo de qualidade'}
                          width={200}
                          height={90}
                          className="object-contain h-[45px] md:h-[70px] w-auto"
                        />
                      )}
                    </motion.div>
                  ))
                ) : (
                  // Fallback com imagens estáticas quando não há selos cadastrados
                  <>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}>
                      <Image src="/pbqp-h.png" alt="PBQP-H" width={200} height={90} className="object-contain h-[45px] md:h-[70px] w-auto" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }}>
                      <Image src="/iso9001.png" alt="ISO 9001" width={150} height={60} className="object-contain h-[35px] md:h-[50px] w-auto" />
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. CTA Trabalhe Conosco — compacto para caber tudo numa tela */}
      <section className="relative w-full min-h-[100vh] flex items-center justify-center py-10 md:py-12 px-4 sm:px-6 lg:px-8">
        <Image 
          src={data?.cta_imagem?.url || '/hero-bg.jpg'} 
          fill 
          className="object-cover object-center z-0" 
          alt="Trabalhe Conosco" 
          quality={85}
        />
        
        <div className="absolute inset-0 bg-black/60 z-0" />

        {/* Great Place To Work — fixado no canto superior direito, alinhado com o topo do banner */}
        <div className="absolute top-0 right-6 md:right-10 lg:right-16 z-20 translate-y-0">
          <Image
            src="/selo-gptw.svg"
            alt="Certificada Great Place To Work 2025"
            width={110}
            height={165}
            className="w-20 md:w-24 lg:w-[110px] h-auto drop-shadow-xl"
          />
        </div>

        {/* Largura aumentada para max-w-4xl (Área vermelha) */}
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
          
          <div className="text-center mb-8 w-full">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight"
            >
              {data?.cta_titulo || 'Pronto para fazer parte de nossa história?'}
            </motion.h2>
            {data?.cta_subtitulo && (
              <p className="text-[14px] md:text-[15px] text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
                {data.cta_subtitulo}
              </p>
            )}
          </div>

          {submitSuccess ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl text-center w-full max-w-2xl shadow-xl">
              <p className="text-white font-bold text-2xl mb-2">Mensagem enviada com sucesso!</p>
              <p className="text-white/80 text-lg">Em breve nossa equipe entrará em contato com você.</p>
            </motion.div>
          ) : (
            // Formulário esticado para max-w-3xl para preencher as margens corretas
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-3 max-w-3xl">
              
              <div className="flex flex-col gap-1 text-left">
                <label htmlFor="nome" className="text-white text-[13px] font-semibold tracking-wide">Nome*</label>
                <input id="nome" type="text" placeholder="Nome completo" className={inputFlatCls} {...register('nome', { required: true })} />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label htmlFor="email" className="text-white text-[13px] font-semibold tracking-wide">E-mail*</label>
                <input id="email" type="email" placeholder="E-mail" className={inputFlatCls} {...register('email', { required: true })} />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label htmlFor="telefone" className="text-white text-[13px] font-semibold tracking-wide">Telefone*</label>
                <input id="telefone" type="tel" placeholder="(11) 99999-9999" className={inputFlatCls} {...register('telefone', { required: true })} />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label htmlFor="mensagem" className="text-white text-[13px] font-semibold tracking-wide">Mensagem*</label>
                <textarea id="mensagem" placeholder="Mensagem" rows={3} className={`${inputFlatCls} resize-none`} {...register('mensagem', { required: true })} />
              </div>

              <button type="submit" disabled={isSubmitting}
                className={`mt-3 mx-auto w-full md:w-auto md:min-w-[220px] px-8 py-3 rounded-full text-white font-semibold text-[14px] transition-all shadow-md ${
                  isSubmitting ? 'bg-gray-400 cursor-not-allowed opacity-70' : 'bg-gradient-to-r from-virtu-green to-virtu-gold hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5'
                }`}>
                {isSubmitting ? 'Enviando...' : 'Entrar em contato'}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}