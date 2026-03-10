'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { EmpreendimentoCard as EmpreendimentoCardType } from '@/lib/api';

/**
 * Card de Empreendimento - Figma: rounded-[44px], overlay, texto Sora
 */

interface Props {
  empreendimento: EmpreendimentoCardType;
}

export default function EmpreendimentoCard({ empreendimento }: Props) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3 }} className="group">
      <Link href={`/empreendimentos/${empreendimento.slug}`}>
        <div className="relative aspect-[3/4] rounded-[24px] overflow-hidden shadow-md">
          {empreendimento.imagem_principal ? (
            <Image
              src={empreendimento.imagem_principal.url}
              alt={empreendimento.imagem_principal.alt || empreendimento.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-virtu-green-dark to-virtu-dark flex items-center justify-center">
              <span className="text-white/50 font-sans text-[14px]">Sem imagem</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

          {empreendimento.status && (
            <div
              className="absolute top-4 left-4 px-3 py-1 rounded-full text-[12px] font-sans font-semibold text-white"
              style={{ backgroundColor: empreendimento.status.cor_badge || '#c1a784' }}
            >
              {empreendimento.status.nome}
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="font-sans font-semibold text-[20px] text-white mb-1 tracking-[-0.2px]">
              {empreendimento.title}
            </h3>
            {empreendimento.cidade && (
              <p className="text-white/70 text-[14px] font-sans font-light">
                {empreendimento.cidade.nome} | {empreendimento.cidade.estado}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
