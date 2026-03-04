'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, MapPin, Bed, Maximize, DollarSign, CheckCircle, Star, Calendar, Building } from 'lucide-react';
import { getEmpreendimento, EmpreendimentoDetalhe } from '@/lib/api';
import ContactForm from '@/components/ui/ContactForm';
import Button from '@/components/ui/Button';
import GaleriaCarrossel from '@/components/ui/GaleriaCarrossel';

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
        <Link href="/empreendimentos">
          <Button>Ver todos os empreendimentos</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] lg:h-[60vh]">
        {emp.imagem_hero ? (
          <Image 
            src={emp.imagem_hero.url} 
            alt={emp.imagem_hero.alt || emp.title} 
            fill 
            className="object-cover" 
            priority
          />
        ) : emp.imagem_principal ? (
          <Image 
            src={emp.imagem_principal.url} 
            alt={emp.imagem_principal.alt || emp.title} 
            fill 
            className="object-cover" 
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-virtu-dark to-virtu-teal" />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </section>

      {/* Info + Form */}
      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              {emp.logo && (
                <div className="mb-6">
                  <Image 
                    src={emp.logo.url} 
                    alt={emp.logo.alt || emp.title} 
                    width={200} 
                    height={80} 
                    className="object-contain" 
                  />
                </div>
              )}
              
              <h1 className="font-display text-3xl lg:text-4xl text-virtu-dark mb-2">
                {emp.subtitulo || (
                  <>Pensando e construindo seu <span className="text-virtu-gold italic">futuro</span> com excelência!</>
                )}
              </h1>
              
              {emp.descricao_curta && (
                <p className="text-gray-600 mt-4">{emp.descricao_curta}</p>
              )}

              {emp.preco_a_partir && (
                <p className="text-virtu-gold text-xl font-medium mt-4">
                  a partir de R$ {Number(emp.preco_a_partir).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              )}

              {emp.descricao && (
                <div 
                  className="mt-6 text-gray-600 prose prose-sm max-w-none" 
                  dangerouslySetInnerHTML={{ __html: emp.descricao }} 
                />
              )}
            </div>
            <div>
              <ContactForm title="Saiba mais!" empreendimentoId={emp.id} />
            </div>
          </div>
        </div>
      </section>

      {/* Galeria em Carrossel */}
      {emp.galeria_imagens && emp.galeria_imagens.length > 0 && (
        <div className="bg-gray-50">
          <GaleriaCarrossel imagens={emp.galeria_imagens} titulo="Galeria" />
        </div>
      )}

      {/* Características */}
      <section className="py-12 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
            {emp.preco_a_partir && (
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-virtu-gold" />
                <span className="text-gray-700">a partir de R$ {Number(emp.preco_a_partir).toLocaleString('pt-BR')}</span>
              </div>
            )}
            {emp.metragem_a_partir && (
              <div className="flex items-center gap-3">
                <Maximize className="w-6 h-6 text-virtu-gold" />
                <span className="text-gray-700">a partir de {emp.metragem_a_partir}m²</span>
              </div>
            )}
            {emp.dormitorios && (
              <div className="flex items-center gap-3">
                <Bed className="w-6 h-6 text-virtu-gold" />
                <span className="text-gray-700">{emp.dormitorios}</span>
              </div>
            )}
            {emp.caracteristicas_resumo && (
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-virtu-gold" />
                <span className="text-gray-700">{emp.caracteristicas_resumo}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      {emp.diferenciais && emp.diferenciais.length > 0 && (
        <section className="py-12 bg-virtu-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl text-center text-virtu-dark mb-8">Diferenciais</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {emp.diferenciais.map((dif, index) => (
                <motion.div
                  key={dif.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl text-center shadow-sm"
                >
                  {dif.icone ? (
                    <div className="w-12 h-12 mx-auto mb-3 relative">
                      <Image src={dif.icone.url} alt={dif.icone.alt || dif.nome} fill className="object-contain" />
                    </div>
                  ) : (
                    <Star className="w-12 h-12 mx-auto mb-3 text-virtu-gold" />
                  )}
                  <h3 className="font-medium text-virtu-dark">{dif.nome}</h3>
                  {dif.descricao && (
                    <p className="text-sm text-gray-500 mt-2">{dif.descricao}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Plantas */}
      {emp.plantas && emp.plantas.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl text-center text-virtu-dark mb-8">Conheça nossa planta!</h2>
            
            {/* Tabs de plantas */}
            <div className="flex justify-center gap-4 mb-8 flex-wrap">
              {emp.plantas.map((planta, index) => (
                <button
                  key={planta.id}
                  onClick={() => setPlantaAtiva(index)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    plantaAtiva === index
                      ? 'bg-virtu-gold text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {planta.nome}
                </button>
              ))}
            </div>

            {/* Conteúdo da planta ativa */}
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {emp.plantas[plantaAtiva]?.imagem && (
                <motion.div 
                  key={plantaAtiva}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative aspect-square rounded-xl overflow-hidden bg-white shadow-lg"
                >
                  <Image
                    src={emp.plantas[plantaAtiva].imagem!.url}
                    alt={emp.plantas[plantaAtiva].imagem!.alt || emp.plantas[plantaAtiva].nome}
                    fill
                    className="object-contain p-4"
                  />
                </motion.div>
              )}
              <div>
                <h3 className="font-display text-2xl text-virtu-dark mb-4">{emp.plantas[plantaAtiva]?.nome}</h3>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  {emp.plantas[plantaAtiva]?.dormitorios && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Bed className="w-5 h-5 text-virtu-gold" />
                      <span>{emp.plantas[plantaAtiva].dormitorios} dormitórios</span>
                    </div>
                  )}
                  {emp.plantas[plantaAtiva]?.metragem && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Maximize className="w-5 h-5 text-virtu-gold" />
                      <span>{emp.plantas[plantaAtiva].metragem}m²</span>
                    </div>
                  )}
                </div>

                {emp.plantas[plantaAtiva]?.descricao && (
                  <p className="text-gray-600 mb-4">{emp.plantas[plantaAtiva].descricao}</p>
                )}

                {emp.plantas[plantaAtiva]?.caracteristicas && emp.plantas[plantaAtiva].caracteristicas.length > 0 && (
                  <ul className="space-y-2">
                    {emp.plantas[plantaAtiva].caracteristicas.map((car, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-virtu-gold mt-1">•</span>
                        <span className="text-gray-700">{car}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Vídeo */}
      {emp.video_url && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl text-center text-virtu-dark mb-8">vídeo {emp.title}</h2>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900 shadow-xl">
              {emp.video_thumbnail ? (
                <Image 
                  src={emp.video_thumbnail.url} 
                  alt={emp.video_thumbnail.alt || `Vídeo ${emp.title}`} 
                  fill 
                  className="object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-virtu-dark to-virtu-teal" />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <a
                  href={emp.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg"
                >
                  <Play className="w-8 h-8 text-virtu-gold ml-1" />
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Cronograma de Obra */}
      {emp.andamentos_obra && emp.andamentos_obra.length > 0 && (
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl text-center text-virtu-dark mb-8">Cronograma de obra</h2>
            <div className="space-y-4">
              {emp.andamentos_obra.map((etapa, index) => (
                <div key={etapa.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">{etapa.titulo}</span>
                    <span className="text-sm font-medium text-virtu-gold">{etapa.percentual}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${etapa.percentual}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-virtu-gold rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fotos da Obra */}
      {emp.fotos_obra && emp.fotos_obra.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl text-center text-virtu-dark mb-8">Andamento das obras</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {emp.fotos_obra.map((foto) => (
                <motion.div 
                  key={foto.id} 
                  whileHover={{ scale: 1.02 }}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm"
                >
                  {foto.imagem && (
                    <Image 
                      src={foto.imagem.url} 
                      alt={foto.descricao || 'Foto da obra'} 
                      fill 
                      className="object-cover" 
                    />
                  )}
                  {foto.data_captura && (
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(foto.data_captura).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Localização */}
      {(emp.endereco || emp.localizacao || emp.bairro) && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl text-virtu-dark mb-6">Localização</h2>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5 text-virtu-gold" />
                <span>{emp.endereco || emp.localizacao}</span>
              </div>
              {emp.bairro && emp.cidade && (
                <p className="text-gray-500">
                  {emp.bairro} - {emp.cidade.nome}/{emp.cidade.estado}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="py-20 bg-virtu-teal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl lg:text-4xl text-white mb-8">
            Vamos conversar sobre o seu <span className="italic">futuro!</span>
          </h2>
          <Link href="/contato">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-virtu-teal">
              Conheça mais
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
