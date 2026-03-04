'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getEmpreendimentos, getCidades, EmpreendimentoCard as EmpCard, Cidade } from '@/lib/api';
import EmpreendimentoCard from '@/components/ui/EmpreendimentoCard';
import ContactForm from '@/components/ui/ContactForm';

export default function EmpreendimentosPage() {
  const [empreendimentos, setEmpreendimentos] = useState<EmpCard[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [cidadeAtiva, setCidadeAtiva] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [emps, cidadesData] = await Promise.all([
          getEmpreendimentos(),
          getCidades(),
        ]);
        setEmpreendimentos(emps);
        setCidades(cidadesData);
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleCidadeFilter = async (cidadeId: number | null) => {
    setCidadeAtiva(cidadeId);
    setLoading(true);
    try {
      const emps = await getEmpreendimentos(cidadeId ? { cidade: cidadeId } : undefined);
      setEmpreendimentos(emps);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-virtu-dark to-virtu-dark/80" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-virtu-gold text-sm font-medium">Em breve</span>
              <h1 className="font-display text-4xl lg:text-5xl text-white mt-4 mb-4">
                Terras de Verano
              </h1>
              <p className="text-white/80">
                Lançamento virtú e Perplan urbanismo na Zona Sul de Ribeirão Preto
              </p>
            </motion.div>
            <ContactForm className="max-w-md ml-auto" />
          </div>
        </div>
      </section>

      {/* Listagem */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl text-virtu-dark mb-8">
            Conheça nossos projetos
          </h2>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3 mb-12">
            <button
              onClick={() => handleCidadeFilter(null)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                cidadeAtiva === null
                  ? 'bg-virtu-gold text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Geral
            </button>
            {cidades.map((cidade) => (
              <button
                key={cidade.id}
                onClick={() => handleCidadeFilter(cidade.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  cidadeAtiva === cidade.id
                    ? 'bg-virtu-gold text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cidade.nome}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-virtu-gold border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {empreendimentos.map((emp) => (
                <EmpreendimentoCard key={emp.id} empreendimento={emp} />
              ))}
            </div>
          )}

          {!loading && empreendimentos.length === 0 && (
            <p className="text-center text-gray-500 py-20">
              Nenhum empreendimento encontrado.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
