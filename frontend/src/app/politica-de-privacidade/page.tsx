'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

interface PoliticaData {
  titulo: string;
  ultima_atualizacao: string | null;
  conteudo: string;
}

export default function PoliticaPrivacidadePage() {
  const [data, setData] = useState<PoliticaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/politica-privacidade/')
      .then(r => {
        const d = r.data;
        // Remove atributos data-block-key gerados pelo Wagtail RichTextField
        if (d?.conteudo) {
          d.conteudo = d.conteudo.replace(/ data-block-key="[^"]*"/g, '');
        }
        setData(d);
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-virtu-gold border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4">
        <h1 className="font-sans font-bold text-2xl text-virtu-dark mb-3">Política de Privacidade</h1>
        <p className="text-virtu-muted font-sans text-[14px] text-center max-w-md">
          Esta página ainda não foi configurada.<br />
          <span className="text-[12px] mt-1 block">Acesse o Wagtail → Páginas → Adicionar Página Filha → Política de Privacidade.</span>
        </p>
      </div>
    );
  }

  return (
    <main className="pt-24 pb-16 md:pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <h1 className="font-sans font-bold text-[28px] sm:text-[36px] md:text-[42px] text-virtu-dark mb-2 leading-tight">
            {data.titulo}
          </h1>
          {data.ultima_atualizacao && (
            <p className="text-virtu-muted font-sans text-[13px] mb-10">
              Última atualização:{' '}
              {new Date(data.ultima_atualizacao).toLocaleDateString('pt-BR', {
                day: '2-digit', month: 'long', year: 'numeric'
              })}
            </p>
          )}
          <div
            className="
              prose prose-sm md:prose-base max-w-none
              font-sans text-virtu-dark
              [&_h1]:font-bold [&_h1]:text-virtu-dark [&_h1]:text-2xl [&_h1]:mt-8 [&_h1]:mb-3
              [&_h2]:font-semibold [&_h2]:text-virtu-dark [&_h2]:text-xl [&_h2]:mt-7 [&_h2]:mb-3
              [&_h3]:font-semibold [&_h3]:text-virtu-dark [&_h3]:text-lg [&_h3]:mt-5 [&_h3]:mb-2
              [&_p]:text-[14px] [&_p]:leading-relaxed [&_p]:mb-4 [&_p]:text-virtu-dark
              [&_ul]:pl-5 [&_ul]:mb-4 [&_li]:text-[14px] [&_li]:mb-1
              [&_a]:text-virtu-green [&_a]:underline
              [&_strong]:font-semibold
            "
            dangerouslySetInnerHTML={{ __html: data.conteudo }}
          />
        </motion.div>
      </div>
    </main>
  );
}
