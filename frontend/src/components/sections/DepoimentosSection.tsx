'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Depoimento } from '@/lib/api';

interface DepoimentosSectionProps {
  titulo?: string;
  depoimentos?: Depoimento[];
}

const defaultDepoimentos: Depoimento[] = [
  {
    id: 1,
    nome: 'Luiza Silva',
    cargo: 'moradora',
    foto: null,
    texto: 'Excelente atendimento e qualidade excepcional. Recomendo a Virtú para quem busca o melhor.',
    avaliacao: 5,
  },
  {
    id: 2,
    nome: 'Luiza Silva',
    cargo: 'moradora',
    foto: null,
    texto: 'Excelente atendimento e qualidade excepcional. Recomendo a Virtú para quem busca o melhor.',
    avaliacao: 5,
  },
  {
    id: 3,
    nome: 'Luiza Silva',
    cargo: 'moradora',
    foto: null,
    texto: 'Excelente atendimento e qualidade excepcional. Recomendo a Virtú para quem busca o melhor.',
    avaliacao: 5,
  },
  {
    id: 4,
    nome: 'Luiza Silva',
    cargo: 'moradora',
    foto: null,
    texto: 'Excelente atendimento e qualidade excepcional. Recomendo a Virtú para quem busca o melhor.',
    avaliacao: 5,
  },
];

export default function DepoimentosSection({ titulo = 'depoimentos reais', depoimentos }: DepoimentosSectionProps) {
  const items = depoimentos && depoimentos.length > 0 ? depoimentos : defaultDepoimentos;
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const currentItems = items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl italic text-virtu-dark text-center mb-12 md:mb-16"
        >
          {titulo}
        </motion.h2>

        {/* Grid de depoimentos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentItems.map((dep, index) => (
            <motion.div
              key={dep.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Estrelas */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < dep.avaliacao ? 'text-virtu-gold fill-virtu-gold' : 'text-gray-300'}
                  />
                ))}
              </div>

              {/* Texto */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6 font-sans font-light">
                &ldquo;{dep.texto}&rdquo;
              </p>

              {/* Autor */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <h4 className="font-sans font-semibold text-virtu-dark text-sm">{dep.nome}</h4>
                  <p className="font-sans text-gray-500 text-xs">{dep.cargo}</p>
                </div>
                {dep.foto ? (
                  <Image
                    src={dep.foto.url}
                    alt={dep.foto.alt || dep.nome}
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-virtu-cream flex items-center justify-center">
                    <span className="text-virtu-gold text-xs font-semibold">
                      {dep.nome.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination dots */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-10">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                className={`w-8 h-8 rounded-full border transition-all ${
                  currentPage === i
                    ? 'border-virtu-teal bg-virtu-teal text-white'
                    : 'border-gray-300 text-gray-500 hover:border-virtu-gold'
                } flex items-center justify-center text-xs font-sans`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
