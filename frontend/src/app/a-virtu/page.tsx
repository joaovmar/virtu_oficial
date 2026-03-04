'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Target, Eye, Heart } from 'lucide-react';
import { getSobreNos, SobreNosData } from '@/lib/api';
import Button from '@/components/ui/Button';

export default function SobreNosPage() {
  const [data, setData] = useState<SobreNosData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const sobreData = await getSobreNos();
        setData(sobreData);
      } catch (error) {
        console.error('Erro:', error);
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
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center">
        {data?.hero_imagem && (
          <Image src={data.hero_imagem.url} alt={data.hero_imagem.alt} fill className="object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 font-display text-5xl lg:text-6xl text-white"
        >
          {data?.hero_titulo || 'a virtú'}
        </motion.h1>
      </section>

      {/* Nossa História */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-4xl text-virtu-dark mb-2">nossa</h2>
              <h2 className="font-display text-5xl text-virtu-gold italic mb-8">
                {data?.historia_titulo || 'história'}
              </h2>
            </div>
            <div className="text-gray-600 rich-text" dangerouslySetInnerHTML={{ __html: data?.historia_texto || '' }} />
          </div>
        </div>
      </section>

      {/* Vídeo */}
      {data?.video_url && (
        <section className="py-20 bg-gray-900">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              {data.video_thumbnail && (
                <Image src={data.video_thumbnail.url} alt={data.video_thumbnail.alt} fill className="object-cover" />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                <a
                  href={data.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors mb-4"
                >
                  <Play className="w-8 h-8 text-virtu-gold ml-1" />
                </a>
                <p className="text-white font-display text-xl">{data.video_titulo}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Missão, Visão, Valores */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Missão */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-virtu-cream flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-virtu-gold" />
              </div>
              <h3 className="font-display text-2xl text-virtu-dark mb-4">{data?.missao_titulo || 'missão'}</h3>
              <div className="text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: data?.missao_texto || '' }} />
            </motion.div>

            {/* Visão */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-virtu-cream flex items-center justify-center mx-auto mb-6">
                <Eye className="w-10 h-10 text-virtu-gold" />
              </div>
              <h3 className="font-display text-2xl text-virtu-dark mb-4">{data?.visao_titulo || 'visão'}</h3>
              <div className="text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: data?.visao_texto || '' }} />
            </motion.div>

            {/* Valores */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-virtu-cream flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-virtu-gold" />
              </div>
              <h3 className="font-display text-2xl text-virtu-dark mb-4">{data?.valores_titulo || 'valores'}</h3>
              <div className="text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: data?.valores_texto || '' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Política de Qualidade */}
      <section className="py-20 bg-virtu-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-virtu-gold italic mb-8">
            {data?.politica_titulo || 'política de qualidade'}
          </h2>
          <div className="text-gray-600 rich-text" dangerouslySetInnerHTML={{ __html: data?.politica_texto || '' }} />
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32">
        {data?.cta_imagem && (
          <Image src={data.cta_imagem.url} alt={data.cta_imagem.alt} fill className="object-cover" />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl lg:text-4xl text-white mb-4">
            {data?.cta_titulo || 'Pronto para fazer parte de nossa história?'}
          </h2>
          <p className="text-white/80 mb-8">{data?.cta_subtitulo}</p>
          <Link href="/contato">
            <Button>{data?.cta_botao_texto || 'Entrar em contato'}</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
