'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { EmpreendimentoCard as EmpreendimentoCardType } from '@/lib/api';

export default function EmpreendimentoCard({ empreendimento }: { empreendimento: EmpreendimentoCardType }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }} className="group">
      <Link href={`/empreendimentos/${empreendimento.slug}`}>
        <div className="relative aspect-[3/4] rounded-xl md:rounded-2xl overflow-hidden shadow-sm">
          {empreendimento.imagem_principal ? (
            <Image src={empreendimento.imagem_principal.url} alt={empreendimento.imagem_principal.alt || empreendimento.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-virtu-green-dark to-virtu-dark flex items-center justify-center"><span className="text-white/50 font-sans text-xs">Sem imagem</span></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent group-hover:from-black/90 group-hover:via-black/40 group-hover:to-black/20 transition-colors duration-500" />
          
          <div className="absolute inset-0 p-4 flex flex-col justify-end">
            <div className="relative z-10">
              {empreendimento.status && (
                <span className="text-white/90 font-sans text-[10px] md:text-xs mb-1 block font-medium">
                  {empreendimento.status.nome}
                </span>
              )}
              <h3 className="font-sans font-semibold text-base md:text-xl text-white mb-0.5 tracking-tight leading-tight">{empreendimento.title}</h3>
              {empreendimento.cidade && (
                <p className="text-white/80 text-[11px] md:text-xs font-sans">{empreendimento.cidade.nome} | {empreendimento.cidade.estado}</p>
              )}
              
              <div className="max-h-0 overflow-hidden opacity-0 group-hover:max-h-[200px] group-hover:opacity-100 transition-all duration-500 ease-in-out">
                <hr className="w-16 md:w-24 border-white/30 my-3 md:my-4" />
                <div className="space-y-1.5 md:space-y-2 pb-1">
                  {empreendimento.metragem_a_partir && (
                    <p className="text-white/90 font-sans text-[11px] md:text-[13px] tracking-wide">A partir de {empreendimento.metragem_a_partir}m²</p>
                  )}
                  {empreendimento.dormitorios && (
                    <p className="text-white/90 font-sans text-[11px] md:text-[13px] tracking-wide">{empreendimento.dormitorios} Dormitórios</p>
                  )}
                  {empreendimento.caracteristicas_resumo && (
                    <p className="text-white/90 font-sans text-[11px] md:text-[13px] tracking-wide">{empreendimento.caracteristicas_resumo}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
