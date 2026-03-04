'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, Home, FileText, Building, Key, Eye } from 'lucide-react';
import { getHome, getEmpreendimentos, HomeData, EmpreendimentoCard as EmpCard } from '@/lib/api';
import EmpreendimentoCard from '@/components/ui/EmpreendimentoCard';
import Button from '@/components/ui/Button';

const journeyIcons = [Home, FileText, Building, Eye, Key];

export default function HomePage() {
  const [data, setData] = useState<HomeData | null>(null);
  const [empreendimentos, setEmpreendimentos] = useState<EmpCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [homeData, emps] = await Promise.all([
          getHome(),
          getEmpreendimentos(),
        ]);
        setData(homeData);
        setEmpreendimentos(emps);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-virtu-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        {data?.hero_imagem ? (
          <Image
            src={data.hero_imagem.url}
            alt={data.hero_imagem.alt || 'Hero'}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-virtu-dark to-virtu-teal" />
        )}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl text-white max-w-3xl"
          >
            {data?.hero_titulo || 'O seu futuro é o nosso propósito'}
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-8 h-8 text-white animate-bounce" />
        </motion.div>
      </section>

      {/* Pensamos no Futuro */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-4xl lg:text-5xl text-virtu-dark mb-2">
                {data?.secao_futuro_titulo?.split(' ')[0] || 'Pensamos'} {data?.secao_futuro_titulo?.split(' ')[1] || 'no'}
              </h2>
              <h2 className="font-display text-5xl lg:text-6xl text-virtu-gold italic mb-8">
                {data?.secao_futuro_titulo?.split(' ')[2] || 'futuro'}
              </h2>
              {data?.secao_futuro_texto && (
                <div
                  className="text-gray-600 rich-text"
                  dangerouslySetInnerHTML={{ __html: data.secao_futuro_texto }}
                />
              )}
            </motion.div>

            {data?.secao_futuro_imagem && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden"
              >
                <Image
                  src={data.secao_futuro_imagem.url}
                  alt={data.secao_futuro_imagem.alt || 'Pensamos no futuro'}
                  fill
                  className="object-cover"
                />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Banner Institucional */}
      {data?.banner_institucional_imagem && (
        <section className="relative py-32">
          <Image
            src={data.banner_institucional_imagem.url}
            alt={data.banner_institucional_imagem.alt || 'Banner institucional'}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-2xl lg:text-4xl text-white leading-relaxed"
            >
              {data.banner_institucional_texto || 'Na virtú acreditamos que não há um único destino.'}
            </motion.p>
          </div>
        </section>
      )}

      {/* Da visão à realidade */}
      <section className="py-20 bg-virtu-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl text-center text-virtu-dark mb-16"
          >
            {data?.secao_jornada_titulo || 'Da visão à realidade'}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {(data?.etapas_jornada || []).map((etapa, index) => {
              const Icon = journeyIcons[index] || Home;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center mx-auto mb-4">
                    {etapa.icone ? (
                      <div className="relative w-10 h-10">
                        <Image src={etapa.icone.url} alt={etapa.icone.alt || etapa.titulo} fill className="object-contain" />
                      </div>
                    ) : (
                      <Icon className="w-8 h-8 text-virtu-gold" />
                    )}
                  </div>
                  <span className="text-virtu-teal font-display text-2xl">{etapa.numero}</span>
                  <h3 className="font-medium text-virtu-dark mt-2 mb-2">{etapa.titulo}</h3>
                  <p className="text-sm text-gray-500">{etapa.descricao}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/empreendimentos">
              <Button variant="outline">Conheça mais</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Empreendimento Destaque */}
      {data?.empreendimento_destaque && (
        <section className="relative py-32">
          {data.empreendimento_destaque.imagem_principal ? (
            <Image
              src={data.empreendimento_destaque.imagem_principal.url}
              alt={data.empreendimento_destaque.imagem_principal.alt || data.empreendimento_destaque.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-virtu-teal to-virtu-dark" />
          )}
          <div className="absolute inset-0 bg-black/50" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-virtu-gold text-sm font-medium">Breve lançamento</span>
              <h2 className="font-display text-4xl lg:text-5xl text-white mt-4 mb-4">
                {data.empreendimento_destaque.title}
              </h2>
              <p className="text-white/80 max-w-xl mb-8">
                {data.banner_destaque_texto || data.empreendimento_destaque.descricao_curta}
              </p>
              <Link href={`/empreendimentos/${data.empreendimento_destaque.slug}`}>
                <Button>Saiba mais!</Button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Empreendimentos */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl text-center text-virtu-dark mb-12">
            Conheça nossos projetos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {empreendimentos.slice(0, 4).map((emp) => (
              <EmpreendimentoCard key={emp.id} empreendimento={emp} />
            ))}
          </div>

          {empreendimentos.length === 0 && (
            <p className="text-center text-gray-500">Nenhum empreendimento disponível no momento.</p>
          )}

          <div className="text-center mt-12">
            <Link href="/empreendimentos">
              <Button variant="outline">Ver todos</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      {data?.depoimentos && data.depoimentos.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-4xl text-center text-virtu-dark mb-12">
              {data?.secao_depoimentos_titulo || 'depoimentos reais'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.depoimentos.map((dep) => (
                <motion.div
                  key={dep.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < dep.avaliacao ? 'text-virtu-gold' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm mb-4">&ldquo;{dep.texto}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    {dep.foto ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden relative">
                        <Image src={dep.foto.url} alt={dep.foto.alt || dep.nome} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-virtu-gold/20 flex items-center justify-center">
                        <span className="text-virtu-gold font-medium text-sm">{dep.nome.charAt(0)}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-virtu-dark text-sm">{dep.nome}</p>
                      <p className="text-gray-500 text-xs">{dep.cargo}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="py-20 bg-virtu-teal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl lg:text-4xl text-white mb-8">
            {data?.cta_titulo || 'Vamos conversar sobre o seu futuro!'}
          </h2>
          <Link href="/contato">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-virtu-teal">
              {data?.cta_botao_texto || 'Conheça mais'}
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
