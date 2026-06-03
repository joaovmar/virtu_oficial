'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { DollarSign, Maximize, BedDouble, Waves, X, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [fotoLightbox, setFotoLightbox] = useState<number | null>(null);

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

  // Formata valor em BRL: 450000 → R$ 450.000,00
  const formatBRL = (valor: string | number | null | undefined) => {
    if (!valor) return '';
    const num = typeof valor === 'string' ? parseFloat(valor) : valor;
    if (isNaN(num)) return String(valor);
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

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

      {/* 2. Logo + Info | Form — logo menor e à esquerda, gap maior */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {emp.logo && (
                <Image
                  src={emp.logo.url}
                  alt={emp.title}
                  width={280}
                  height={80}
                  className="object-contain object-left mb-5 md:mb-7 h-[50px] sm:h-[60px] md:h-[70px] w-auto"
                />
              )}
              {!emp.logo && <h2 className="font-sans font-bold text-2xl md:text-3xl lg:text-4xl text-virtu-dark mb-5 md:mb-7">{emp.title}</h2>}
              {emp.subtitulo && (
                <h3 className="font-sans font-bold text-lg sm:text-xl md:text-2xl text-virtu-green leading-snug mb-4 md:mb-6">{emp.subtitulo}</h3>
              )}
              {emp.descricao && (
                <div className="font-sans font-light text-xs md:text-sm text-virtu-text leading-relaxed tracking-tight max-w-lg [&_p]:mb-3" dangerouslySetInnerHTML={{ __html: emp.descricao }} />
              )}
              {emp.preco_a_partir && (
                <p className="mt-5 md:mt-7 text-virtu-green font-sans font-bold text-base md:text-lg underline underline-offset-4 decoration-virtu-green/30">
                  a partir de {formatBRL(emp.preco_a_partir)}
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
              <div className="flex items-center gap-1.5 md:gap-2 text-virtu-text"><DollarSign className="w-4 h-4 md:w-5 md:h-5 text-virtu-green" /><span className="font-sans text-[11px] md:text-xs">a partir de {formatBRL(emp.preco_a_partir)}</span></div>
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
        imagemFundo={emp.imagem_hero?.url || emp.imagem_principal?.url || undefined}
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

      {/* 9. FOTOS DA OBRA — com lightbox ao clicar */}
      {emp.fotos_obra && emp.fotos_obra.length > 0 && (
        <section className="py-8 md:py-10 lg:py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-sans font-light text-lg md:text-2xl text-virtu-dark text-center mb-6 md:mb-10 tracking-tight">Andamento das obras</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
              {emp.fotos_obra.map((foto, i) => (
                <motion.div
                  key={foto.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 6) * 0.08, duration: 0.45 }}
                  className="relative aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden shadow-sm group cursor-pointer"
                  onClick={() => setFotoLightbox(i)}
                >
                  {foto.imagem && (
                    <Image
                      src={foto.imagem.url}
                      alt={foto.descricao || ''}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  {/* Overlay sutil ao hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <Maximize className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  {foto.data_captura && (
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      <span className="text-[10px] font-sans text-virtu-text">{new Date(foto.data_captura).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Lightbox fotos da obra */}
          {fotoLightbox !== null && emp.fotos_obra[fotoLightbox] && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center"
              onClick={() => setFotoLightbox(null)}
            >
              <button
                onClick={() => setFotoLightbox(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 z-10"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setFotoLightbox(p => p! > 0 ? p! - 1 : emp.fotos_obra.length - 1); }}
                className="absolute left-3 md:left-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <motion.div
                key={fotoLightbox}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="relative max-w-5xl max-h-[85vh] w-full mx-14"
                onClick={(e) => e.stopPropagation()}
              >
                {emp.fotos_obra[fotoLightbox].imagem && (
                  <Image
                    src={emp.fotos_obra[fotoLightbox].imagem!.url}
                    alt={emp.fotos_obra[fotoLightbox].descricao || ''}
                    width={emp.fotos_obra[fotoLightbox].imagem!.width || 1200}
                    height={emp.fotos_obra[fotoLightbox].imagem!.height || 800}
                    className="object-contain w-full h-full max-h-[85vh]"
                  />
                )}
                {emp.fotos_obra[fotoLightbox].data_captura && (
                  <p className="text-center text-white/60 text-xs font-sans mt-3">
                    {new Date(emp.fotos_obra[fotoLightbox].data_captura!).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    {emp.fotos_obra[fotoLightbox].descricao && ` — ${emp.fotos_obra[fotoLightbox].descricao}`}
                  </p>
                )}
              </motion.div>
              <button
                onClick={(e) => { e.stopPropagation(); setFotoLightbox(p => p! < emp.fotos_obra.length - 1 ? p! + 1 : 0); }}
                className="absolute right-3 md:right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-xs font-sans">
                {fotoLightbox + 1} / {emp.fotos_obra.length}
              </div>
            </motion.div>
          )}
        </section>
      )}
    </>
  );
}
