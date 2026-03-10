'use client';

import { motion } from 'framer-motion';
import { Headphones, Home, FileSignature, HardHat, KeyRound } from 'lucide-react';
import { EtapaJornada } from '@/lib/api';
import Link from 'next/link';

/**
 * Seção "Da visão à realidade" - Figma: node 1:1937
 * Fundo: #1e3d34 (virtu-green-dark)
 * Título: Newsreader Medium Italic, #c1a784
 * Números: Newsreader Medium Italic, #c1a784 com opacidade
 * Subtítulos: Sora, branco
 * Texto: Sora ExtraLight, branco/80
 * Ícones: círculos com borda #c1a784
 * Botão: bg #348981 border branco/10, rounded-full
 */

const defaultEtapas = [
  { numero: '01', titulo: 'Consultoria', descricao: 'Defina suas necessidades e preferências.' },
  { numero: '02', titulo: 'Seleção do empreendimento ideal', descricao: 'Apresentação das escolhas mais alinhadas ao que você busca.' },
  { numero: '03', titulo: 'Assinatura & Formalização', descricao: 'Consolidação da sua decisão com clareza e confiança.' },
  { numero: '04', titulo: 'Acompanhamento da obra', descricao: 'Transparência em cada etapa da construção.' },
  { numero: '05', titulo: 'Entrega das chaves', descricao: 'O momento em que sua escolha ganha forma.' },
];

const icones = [Headphones, Home, FileSignature, HardHat, KeyRound];

interface JornadaSectionProps {
  titulo?: string;
  etapas?: EtapaJornada[];
}

export default function JornadaSection({ titulo = 'Da visão à realidade', etapas }: JornadaSectionProps) {
  const items = etapas && etapas.length > 0 ? etapas : defaultEtapas;

  return (
    <section className="bg-virtu-green-dark py-20 md:py-32 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display font-medium italic text-[40px] md:text-[55px] text-virtu-gold text-center mb-16 md:mb-24"
        >
          {titulo}
        </motion.h2>

        {/* Etapas em coluna vertical */}
        <div className="flex flex-col gap-10 md:gap-14 max-w-[800px] mx-auto">
          {items.map((etapa, idx) => {
            const Icon = icones[idx] || Headphones;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`flex items-start gap-6 ${idx % 2 !== 0 ? 'md:flex-row-reverse md:text-right' : ''}`}
              >
                <div className="w-[65px] h-[65px] rounded-full bg-virtu-green/30 border border-virtu-gold/30 flex items-center justify-center shrink-0">
                  <Icon className="w-[30px] h-[30px] text-virtu-gold" strokeWidth={1.5} />
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="font-display font-medium italic text-[80px] md:text-[120px] text-virtu-gold/20 leading-none">
                    {etapa.numero}
                  </span>
                  <div>
                    <h3 className="font-sans font-semibold text-white text-[16px] md:text-[18px] mb-1">
                      {etapa.titulo}
                    </h3>
                    <p className="font-sans font-extralight text-white/60 text-[13px] md:text-[14px] leading-relaxed max-w-[300px]">
                      {etapa.descricao}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex justify-center mt-14">
          <Link
            href="/empreendimentos"
            className="bg-virtu-green hover:bg-virtu-green/80 text-white font-sans font-light text-[16px] px-12 py-4 rounded-[38px] transition-colors border border-white/10"
          >
            Conheça mais
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
