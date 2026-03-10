'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { DollarSign, Maximize, BedDouble, Waves, ChevronLeft, ChevronRight } from 'lucide-react';
import { getEmpreendimento, EmpreendimentoDetalhe } from '@/lib/api';
import ContactForm from '@/components/ui/ContactForm';
import GaleriaCarrossel from '@/components/ui/GaleriaCarrossel';
import VideoPlayer from '@/components/ui/VideoPlayer';
import CTASection from '@/components/sections/CTASection';

export default function EmpreendimentoDetalhePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [emp, setEmp] = useState<EmpreendimentoDetalhe | null>(null);
  const [loading, setLoading] = useState(true);
  const [plantaAtiva, setPlantaAtiva] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getEmpreendimento(slug);
        setEmp(data);
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-virtu-gold border-t-transparent" />
      </div>
    );
  }

  if (!emp) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <h1 className="font-display text-3xl text-virtu-dark mb-4">Empreendimento não encontrado</h1>
      </div>
    );
  }

  // Extrair video ID do YouTube
  const videoId = emp.video_url?.includes('youtube')
    ? emp.video_url.split('v=')[1]?.split('&')[0]
    : emp.video_url?.includes('youtu.be')
    ? emp.video_url.split('/').pop()
    : '';

  return (
    <>
      {/* ================================================================
          1. HERO: Banner + Info + Formulário
          ================================================================ */}
      <section className="relative">
        {/* Banner superior */}
        <div className="relative h-[350px] md:h-[450px] mx-4 md:mx-14 mt-2 rounded-b-[2rem] overflow-hidden">
          {emp.imagem_hero ? (
            <Image src={emp.imagem_hero.url} alt={emp.title} fill className="object-cover" priority />
          ) : emp.imagem_principal ? (
            <Image src={emp.imagem_principal.url} alt={emp.title} fill className="object-cover" priority />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-virtu-dark to-virtu-teal" />
          )}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Conteúdo sobreposto */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-12">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Esquerda: Info */}
            <div className="pt-28 md:pt-32">
              {emp.logo && (
                <Image
                  src={emp.logo.url}
                  alt={emp.title}
                  width={300}
                  height={100}
                  className="object-contain mb-6"
                />
              )}
              <h1 className="font-display text-3xl md:text-4xl text-virtu-dark mb-2">
                {emp.subtitulo || 'Pensando e construindo seu futuro com excelência!'}
              </h1>
              <div
                className="text-gray-600 font-sans font-light text-sm md:text-base leading-relaxed mt-4 max-w-lg [&_p]:mb-3"
                dangerouslySetInnerHTML={{ __html: emp.descricao }}
              />
              {emp.preco_a_partir && (
                <p className="mt-6 text-virtu-teal font-sans font-semibold text-lg underline underline-offset-4 decoration-virtu-gold/40">
                  a partir de {emp.preco_a_partir}
                </p>
              )}
            </div>

            {/* Direita: Formulário */}
            <div className="lg:mt-0 mt-8">
              <ContactForm
                title="Saiba mais!"
                empreendimentoId={emp.id}
                className="bg-white rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          2. GALERIA
          ================================================================ */}
      {emp.galeria_imagens && emp.galeria_imagens.length > 0 && (
        <GaleriaCarrossel imagens={emp.galeria_imagens} titulo="Galeria" />
      )}

      {/* ================================================================
          3. ÍCONES: Preço, Metragem, Dormitórios, Lazer
          ================================================================ */}
      <section className="py-8 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {emp.preco_a_partir && (
              <div className="flex items-center gap-3 text-gray-600">
                <DollarSign className="w-6 h-6 text-virtu-gold" />
                <span className="font-sans text-sm">a partir de {emp.preco_a_partir}</span>
              </div>
            )}
            {emp.metragem_a_partir && (
              <div className="flex items-center gap-3 text-gray-600">
                <Maximize className="w-6 h-6 text-virtu-gold" />
                <span className="font-sans text-sm">a partir de {emp.metragem_a_partir}</span>
              </div>
            )}
            {emp.dormitorios && (
              <div className="flex items-center gap-3 text-gray-600">
                <BedDouble className="w-6 h-6 text-virtu-gold" />
                <span className="font-sans text-sm">{emp.dormitorios}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-gray-600">
              <Waves className="w-6 h-6 text-virtu-gold" />
              <span className="font-sans text-sm">lazer completo</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          4. CONHEÇA NOSSA PLANTA
          ================================================================ */}
      {emp.plantas && emp.plantas.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl md:text-4xl italic text-virtu-dark text-center mb-10">
              Conheça nossa planta!
            </h2>

            {/* Tabs */}
            <div className="flex justify-center gap-3 mb-12">
              {emp.plantas.map((planta, idx) => (
                <button
                  key={planta.id}
                  onClick={() => setPlantaAtiva(idx)}
                  className={`px-8 py-3 rounded-full text-sm font-sans font-medium transition-all ${
                    plantaAtiva === idx
                      ? 'bg-virtu-gold text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-virtu-gold'
                  }`}
                >
                  {planta.nome}
                </button>
              ))}
            </div>

            {/* Planta image */}
            <div className="max-w-4xl mx-auto">
              {emp.plantas[plantaAtiva]?.imagem ? (
                <motion.div
                  key={plantaAtiva}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full aspect-[16/9]"
                >
                  <Image
                    src={emp.plantas[plantaAtiva].imagem!.url}
                    alt={emp.plantas[plantaAtiva].nome}
                    fill
                    className="object-contain"
                  />
                </motion.div>
              ) : (
                <div className="w-full aspect-[16/9] bg-gray-50 rounded-2xl flex items-center justify-center">
                  <span className="text-gray-400 font-sans">Planta não disponível</span>
                </div>
              )}

              {/* Características */}
              {emp.plantas[plantaAtiva]?.caracteristicas && emp.plantas[plantaAtiva].caracteristicas.length > 0 && (
                <div className="flex flex-wrap gap-4 justify-center mt-8">
                  {emp.plantas[plantaAtiva].caracteristicas.map((carac, i) => (
                    <span key={i} className="text-gray-600 font-sans text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-virtu-gold" />
                      {carac}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================
          5. CTA: "Vamos conversar sobre o seu futuro!"
          ================================================================ */}
      <CTASection />

      {/* ================================================================
          6. VÍDEO DO EMPREENDIMENTO
          ================================================================ */}
      {videoId && (
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <VideoPlayer
              videoId={videoId}
              title={`vídeo ${emp.title}`}
              thumbnailUrl={emp.video_thumbnail?.url || emp.imagem_principal?.url || '/video-thumb.jpg'}
            />
          </div>
        </section>
      )}

      {/* ================================================================
          7. CRONOGRAMA DE OBRA
          ================================================================ */}
      {emp.andamentos_obra && emp.andamentos_obra.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl md:text-4xl text-virtu-dark text-center mb-12">
              Cronograma de obra
            </h2>

            <div className="space-y-6">
              {emp.andamentos_obra.map((andamento) => (
                <div key={andamento.id} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-sm text-gray-600">{andamento.titulo}</span>
                    <span className="font-sans text-sm font-semibold text-virtu-teal">{andamento.percentual}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${andamento.percentual}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-virtu-gold rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================
          8. ANDAMENTO DAS OBRAS (fotos)
          ================================================================ */}
      {emp.fotos_obra && emp.fotos_obra.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl md:text-4xl text-virtu-dark text-center mb-12">
              Andamento das obras
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {emp.fotos_obra.slice(0, 6).map((foto) => (
                <div key={foto.id} className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md group">
                  {foto.imagem && (
                    <Image
                      src={foto.imagem.url}
                      alt={foto.descricao || 'Foto da obra'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  {foto.data_captura && (
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-xs font-sans text-gray-600">
                        {new Date(foto.data_captura).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
