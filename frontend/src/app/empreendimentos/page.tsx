'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getEmpreendimentos, getCidades, EmpreendimentoCard as EmpCard, Cidade } from '@/lib/api';
import EmpreendimentoCard from '@/components/ui/EmpreendimentoCard';
import ContactForm from '@/components/ui/ContactForm';

/**
 * Página Empreendimentos - Figma: "Web - 1º tiro - empreendimentos" (node 1:258)
 * Hero: banner empreendimento (node 1:275) com form (node 1:276)
 * "Futuros lançamentos" + banner (node 1:279)
 */

export default function EmpreendimentosPage() {
  const [empreendimentos, setEmpreendimentos] = useState<EmpCard[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [cidadeAtiva, setCidadeAtiva] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [emps, cidadesData] = await Promise.all([getEmpreendimentos(), getCidades()]);
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
      {/* ================================================================
          1. HERO: Banner com Form
          Figma: rounded-[44px] com overlay rgba(20,20,20,0.67)
          ================================================================ */}
      <section className="relative min-h-[550px] md:min-h-[650px] flex items-center pt-24 pb-12">
        <div className="absolute inset-0 z-0 mx-4 md:mx-14 mt-2 rounded-[44px] overflow-hidden">
          <Image src="/vila-do-golfe-bg.jpg" alt="Empreendimento" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-[rgba(20,20,20,0.67)]" />
        </div>

        <div className="relative z-10 max-w-[1696px] mx-auto px-6 lg:px-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-white">
              <span className="font-sans font-normal text-[20px] md:text-[24.375px] tracking-[-0.24px] mb-3 block">
                Breve lançamento
              </span>
              <h1 className="font-sans font-light text-[28px] md:text-[40px] leading-tight mb-6">
                Casas sobrado na<br />região da Vila do Golfe<br />em Ribeirão Preto - SP
              </h1>
              <div className="flex items-center gap-6 mt-6">
                <Image src="/perplan-logo-white.svg" alt="Perplan" width={160} height={65} className="object-contain h-[50px] md:h-[65px] w-auto" />
                <Image src="/virtu-logo-white.svg" alt="Virtú" width={85} height={34} className="object-contain h-[26px] md:h-[34px] w-auto" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <ContactForm title="Cadastre-se e saiba mais!" className="bg-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================
          2. Futuros Lançamentos
          ================================================================ */}
      <section className="py-16 md:py-24">
        <div className="text-center mb-12">
          <p className="font-sans font-light text-[36px] md:text-[50px] text-virtu-dark leading-none">Futuros</p>
          <p className="font-display font-medium italic text-[50px] md:text-[75px] text-virtu-green leading-[0.9]">lançamentos</p>
        </div>

        {/* Banner de lançamentos (placeholder) */}
        <div className="relative w-full h-[400px] md:h-[600px] lg:h-[785px] overflow-hidden">
          <Image src="/ribeirao-preto-bg.jpg" alt="Ribeirão Preto" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
            <div className="max-w-7xl mx-auto">
              <h3 className="text-white font-sans font-semibold text-[32px] md:text-[50px] tracking-[-0.5px] mb-3">
                Ribeirão Preto | SP
              </h3>
              <p className="text-white/90 font-sans font-light text-[16px] md:text-[20px] tracking-[-0.2px] max-w-2xl">
                Ribeirão Preto, cidade que pulsa crescimento e qualidade de vida, em breve receberá novos lançamentos da virtú.
              </p>
            </div>
          </div>
          <button className="absolute left-[3%] top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors" aria-label="Anterior">
            <ChevronLeft size={35} strokeWidth={1.5} />
          </button>
          <button className="absolute right-[3%] top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors" aria-label="Próximo">
            <ChevronRight size={35} strokeWidth={1.5} />
          </button>
        </div>
      </section>
    </>
  );
}
