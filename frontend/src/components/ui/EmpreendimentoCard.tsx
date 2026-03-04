'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { EmpreendimentoCard as EmpreendimentoCardType } from '@/lib/api';

interface Props {
  empreendimento: EmpreendimentoCardType;
}

export default function EmpreendimentoCard({ empreendimento }: Props) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link href={`/empreendimentos/${empreendimento.slug}`}>
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
          {empreendimento.imagem_principal ? (
            <Image
              src={empreendimento.imagem_principal.url}
              alt={empreendimento.imagem_principal.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Sem imagem</span>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Status badge */}
          {empreendimento.status && (
            <div
              className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: empreendimento.status.cor_badge }}
            >
              {empreendimento.status.nome}
            </div>
          )}

          {/* Info */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="font-display text-xl mb-1">{empreendimento.title}</h3>
            {empreendimento.cidade && (
              <p className="text-sm opacity-80">
                {empreendimento.cidade.nome} | {empreendimento.cidade.estado}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
