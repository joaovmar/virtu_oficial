'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { DollarSign, Maximize, BedDouble, Waves } from 'lucide-react';
import { getEmpreendimento, EmpreendimentoDetalhe } from '@/lib/api';
import ContactForm from '@/components/ui/ContactForm';
import GaleriaCarrossel from '@/components/ui/GaleriaCarrossel';
import VideoPlayer from '@/components/ui/VideoPlayer';
import LeadCaptureSection from '@/components/sections/LeadCaptureSection';

export default function EmpreendimentoDetalhePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [emp, setEmp] = useState<EmpreendimentoDetalhe | null>(null);
  const [loading, setLoading] = useState(true);
  const [plantaAtiva, setPlantaAtiva] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try { const data = await getEmpreendimento(slug); setEmp(data); }
      catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    if (slug) fetchData();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="animate-spin rounded-full h-10 w-10 border-4 border-virtu-gold border-t-transparent" /></div>;
  if (!emp) return <div className="min-h-screen flex flex-col items-center justify-center pt-20"><h1 className="font-sans text-xl text-virtu-dark">Empreendimento não encontrado</h1></div>;

  const videoId = emp.video_url?.includes('youtube') ? emp.video_url.split('v=')[1]?.split('&')[0] : emp.video_url?.includes('youtu.be') ? emp.video_url.split('/').pop() : '';
  const plantaAtual = emp.plantas?.[plantaAtiva];

  return (
    <>
      {/* 1. BANNER */}
      <section className="pt-20 md:pt-24">
        <div className="mx-3 sm:mx-6 md:mx-10 lg:mx-14 rounded-2xl md:rounded-[44px] overflow-hidden">
          <div className="relative h-[35vh] sm:h-[40vh] md:h-[50vh] lg:h-[55vh] min-h-[200px] max-h-[520px]">
            {(emp.imagem_hero || emp.imagem_principal) ? (
              <Image src={(emp.imagem_hero || emp.imagem_principal)!.url} alt={emp.title} fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-virtu-green-dark to-virtu-dark" />
            )}
          </div>
        </div>
      </section>

      {/* 2. Logo + Info | Form */}
      <section className="py-6 md:py-8 lg:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-12 items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {emp.logo && (
                <Image src={emp.logo.url} alt={emp.title} width={400} height={120} className="object-contain mb-5 md:mb-7 h-[70px] sm:h-[90px] md:h-[110px] lg:h-[130px] w-auto" />
              )}
              {!emp.logo && <h2 className="font-sans font-bold text-2xl md:text-3xl lg:text-4xl text-virtu-dark mb-5 md:mb-7">{emp.title}</h2>}
              {emp.subtitulo && (
                <h3 className="font-display font-bold italic text-lg sm:text-xl md:text-2xl text-virtu-green leading-snug mb-4 md:mb-6">{emp.subtitulo}</h3>
              )}
              {emp.descricao && (
                <div className="font-sans font-light text-xs md:text-sm text-virtu-text leading-relaxed tracking-tight max-w-lg [&_p]:mb-3" dangerouslySetInnerHTML={{ __html: emp.descricao }} />
              )}
              {emp.preco_a_partir && (
                <p className="mt-5 md:mt-7 text-virtu-green font-sans font-bold text-base md:text-lg underline underline-offset-4 decoration-virtu-green/30">
                  a partir de R${emp.preco_a_partir}
                </p>
              )}
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="w-full max-w-[440px] mx-auto lg:mx-0">
              <ContactForm title="Saiba mais!" empreendimentoId={emp.id} className="bg-white rounded-2xl shadow-lg border border-gray-100" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. GALERIA */}
      {emp.galeria_imagens && emp.galeria_imagens.length > 0 && (
        <GaleriaCarrossel imagens={emp.galeria_imagens} titulo="Galeria" />
      )}

      {/* 4. INFO ICONS */}
      <section className="py-4 md:py-5 border-y border-virtu-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-14">
            {emp.preco_a_partir && (
              <div className="flex items-center gap-1.5 md:gap-2 text-virtu-text"><DollarSign className="w-4 h-4 md:w-5 md:h-5 text-virtu-green" /><span className="font-sans text-[11px] md:text-xs">a partir de R${emp.preco_a_partir}</span></div>
            )}
            {emp.metragem_a_partir && (
              <div className="flex items-center gap-1.5 md:gap-2 text-virtu-text"><Maximize className="w-4 h-4 md:w-5 md:h-5 text-virtu-green" /><span className="font-sans text-[11px] md:text-xs">a partir de {emp.metragem_a_partir}m²</span></div>
            )}
            {emp.dormitorios && (
              <div className="flex items-center gap-1.5 md:gap-2 text-virtu-text"><BedDouble className="w-4 h-4 md:w-5 md:h-5 text-virtu-green" /><span className="font-sans text-[11px] md:text-xs">{emp.dormitorios}</span></div>
            )}
            <div className="flex items-center gap-1.5 md:gap-2 text-virtu-text"><Waves className="w-4 h-4 md:w-5 md:h-5 text-virtu-green" /><span className="font-sans text-[11px] md:text-xs">lazer completo</span></div>
          </div>
        </div>
      </section>

      {/* 5. PLANTA */}
      {emp.plantas && emp.plantas.length > 0 && (
        <section className="py-6 md:py-8 lg:py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-sans font-light text-lg md:text-2xl lg:text-[28px] text-virtu-dark text-center mb-4 md:mb-6 tracking-tight">
              Conheça nossa planta!
            </h2>
            {emp.plantas.length > 1 && (
              <div className="flex justify-center gap-2 md:gap-3 mb-4 md:mb-6">
                {emp.plantas.map((planta, idx) => (
                  <button key={planta.id} onClick={() => setPlantaAtiva(idx)}
                    className={`px-5 md:px-8 py-2 md:py-3 rounded-lg text-xs md:text-sm font-sans font-bold uppercase tracking-wider transition-all min-w-[100px] md:min-w-[160px] ${
                      plantaAtiva === idx ? 'bg-virtu-green-dark text-white' : 'bg-white text-virtu-text border border-virtu-border hover:border-virtu-green'
                    }`}>
                    {planta.nome}
                  </button>
                ))}
              </div>
            )}
            <div className="max-w-5xl mx-auto">
              {plantaAtual?.imagem ? (
                <motion.div key={plantaAtiva} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
                  className="relative w-full" style={{ aspectRatio: '2.2 / 1' }}>
                  <Image src={plantaAtual.imagem.url} alt={plantaAtual.nome} fill className="object-contain" />
                </motion.div>
              ) : null}
              {plantaAtual?.caracteristicas && plantaAtual.caracteristicas.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-8 md:gap-14 mt-3 md:mt-5">
                  {(() => {
                    const mid = Math.ceil(plantaAtual.caracteristicas.length / 2);
                    return (
                      <>
                        <div className="text-center sm:text-left">
                          {plantaAtual.caracteristicas.slice(0, mid).map((c, i) => <p key={i} className="text-virtu-text font-sans text-xs md:text-sm leading-snug">{c}</p>)}
                        </div>
                        {plantaAtual.caracteristicas.slice(mid).length > 0 && (
                          <div className="text-center sm:text-left">
                            {plantaAtual.caracteristicas.slice(mid).map((c, i) => <p key={i} className="text-virtu-text font-sans text-xs md:text-sm leading-snug">{c}</p>)}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 6. CTA BANNER */}
      <LeadCaptureSection
        titulo={`${emp.title}\n${emp.cidade?.nome || ''} - ${emp.cidade?.estado || ''}`}
        imagemFundo={emp.imagem_hero?.url || emp.imagem_principal?.url}
      />

      {/* 7. VÍDEO — mesma largura max do cronograma */}
      {videoId && (
        <section className="py-6 md:py-10 lg:py-14 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <VideoPlayer videoId={videoId} title={`vídeo ${emp.title}`} thumbnailUrl={emp.video_thumbnail?.url || emp.imagem_principal?.url || '/video-thumb.jpg'} />
          </div>
        </section>
      )}

      {/* 8. CRONOGRAMA — Figma: barras finas com label acima, % à direita */}
      {emp.andamentos_obra && emp.andamentos_obra.length > 0 && (
        <section className="py-8 md:py-10 lg:py-14 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-sans font-light text-xl md:text-2xl lg:text-3xl text-virtu-dark text-center mb-6 md:mb-10 tracking-tight">
              Cronograma de obra
            </h2>
            <div className="space-y-4 md:space-y-5">
              {emp.andamentos_obra.map((a) => (
                <div key={a.id}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-sans text-xs md:text-sm text-virtu-text">{a.titulo}</span>
                    <span className="font-sans text-xs md:text-sm font-semibold text-virtu-green">{a.percentual}%</span>
                  </div>
                  <div className="w-full relative h-2.5 md:h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${a.percentual}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="h-full bg-virtu-green rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. FOTOS DA OBRA */}
      {emp.fotos_obra && emp.fotos_obra.length > 0 && (
        <section className="py-8 md:py-10 lg:py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-sans font-light text-lg md:text-2xl text-virtu-dark text-center mb-6 md:mb-10 tracking-tight">Andamento das obras</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
              {emp.fotos_obra.slice(0, 6).map((foto, i) => (
                <motion.div
                  key={foto.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.45 }}
                  className="relative aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden shadow-sm group"
                >
                  {foto.imagem && <Image src={foto.imagem.url} alt={foto.descricao || ''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />}
                  {foto.data_captura && (
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      <span className="text-[10px] font-sans text-virtu-text">{new Date(foto.data_captura).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
