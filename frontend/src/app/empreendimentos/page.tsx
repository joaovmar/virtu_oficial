'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getEmpreendimentos, getEmpreendimentosDestaques, getCidades, getEmpreendimentosConfig, EmpreendimentoCard as EmpCard, Cidade, EmpreendimentosIndexConfig } from '@/lib/api';
import EmpreendimentoCard from '@/components/ui/EmpreendimentoCard';
import ContactForm from '@/components/ui/ContactForm';

export default function EmpreendimentosPage() {
  const [empreendimentos, setEmpreendimentos] = useState<EmpCard[]>([]);
  const [destaques, setDestaques] = useState<EmpCard[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [pageConfig, setPageConfig] = useState<EmpreendimentosIndexConfig | null>(null);
  const [cidadeAtiva, setCidadeAtiva] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [lancIdx, setLancIdx] = useState(0);

  useEffect(() => { async function f() { try {
    const [e, c, d, cfg] = await Promise.all([getEmpreendimentos().catch(() => []), getCidades().catch(() => []), getEmpreendimentosDestaques().catch(() => []), getEmpreendimentosConfig().catch(() => null)]);
    setEmpreendimentos(Array.isArray(e) ? e : []); setCidades(Array.isArray(c) ? c : []); setDestaques(Array.isArray(d) ? d : []); setPageConfig(cfg);
  } catch {} finally { setLoading(false); } } f(); }, []);

  const handleFilter = async (id: number | null) => {
    setCidadeAtiva(id); setLoading(true);
    try { const e = await getEmpreendimentos(id ? { cidade: id } : undefined); setEmpreendimentos(Array.isArray(e) ? e : []); }
    catch {} finally { setLoading(false); }
  };

  const activeLanc = destaques.length > 0 ? destaques[lancIdx] : null;

  return (
    <>
      {/* 1. HERO — Banner arredondado Figma */}
      <section className="relative min-h-[420px] sm:min-h-[480px] md:min-h-[540px] lg:min-h-[600px] flex items-center pt-20 md:pt-24 pb-6 md:pb-10">
        <div className="absolute inset-0 z-0 mx-3 sm:mx-6 md:mx-10 lg:mx-14 mt-2 rounded-2xl md:rounded-[44px] overflow-hidden">
          <Image src={pageConfig?.hero_imagem?.url || '/vila-do-golfe-bg.jpg'} alt="Empreendimento" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-[rgba(20,20,20,0.67)]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-5 lg:gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-white text-center lg:text-left">
              <span className="font-sans text-xs md:text-sm tracking-tight mb-1 md:mb-2 block">Breve lançamento</span>
              <h1 className="font-sans font-light text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight mb-3 md:mb-5">
                Casas sobrado na<br />região da Vila do Golfe<br />em Ribeirão Preto - SP
              </h1>
              <div className="flex items-center justify-center lg:justify-start gap-3 md:gap-5 mt-3 md:mt-6">
                <Image src="/perplan-logo-white.svg" alt="Perplan" width={160} height={65} className="object-contain h-[28px] sm:h-[36px] md:h-[50px] w-auto" />
                <Image src="/virtu-logo-white.svg" alt="virtú" width={85} height={34} className="object-contain h-[16px] sm:h-[20px] md:h-[26px] w-auto" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full max-w-[380px] mx-auto lg:mx-0 lg:ml-auto">
              <ContactForm title="Cadastre-se e saiba mais!" className="bg-transparent [&_label]:text-white [&_h3]:text-white" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. GRID */}
      <section className="py-8 md:py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {cidades.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6 md:mb-8 justify-center">
              <button onClick={() => handleFilter(null)} className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-sans font-semibold ${cidadeAtiva === null ? 'bg-virtu-gold text-white' : 'bg-white text-virtu-text border border-virtu-border hover:border-virtu-gold'}`}>Todos</button>
              {cidades.map((c) => (
                <button key={c.id} onClick={() => handleFilter(c.id)} className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-sans font-semibold ${cidadeAtiva === c.id ? 'bg-virtu-gold text-white' : 'bg-white text-virtu-text border border-virtu-border hover:border-virtu-gold'}`}>{c.nome}</button>
              ))}
            </div>
          )}
          {loading ? (
            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-4 border-virtu-gold border-t-transparent" /></div>
          ) : empreendimentos.length > 0 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5"
            >
              {empreendimentos.map((e) => (
                <motion.div
                  key={e.id}
                  variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}
                >
                  <EmpreendimentoCard empreendimento={e} />
                </motion.div>
              ))}
            </motion.div>
          ) : <p className="text-center text-virtu-muted py-12 font-sans text-sm">Nenhum empreendimento encontrado.</p>}
        </div>
      </section>

      {/* 3. Futuros lançamentos */}
      <section className="py-8 md:py-12 lg:py-16 bg-white">
        <div className="text-center mb-5 md:mb-8 px-4">
          <p className="font-sans font-light text-xl sm:text-2xl md:text-3xl text-virtu-dark leading-none">Futuros</p>
          <p className="font-display font-medium italic text-3xl sm:text-4xl md:text-5xl text-virtu-green leading-[0.9]">lançamentos</p>
        </div>
        <div className="relative mx-3 sm:mx-6 md:mx-10 lg:mx-14 h-[40vh] sm:h-[45vh] md:h-[52vh] lg:h-[58vh] min-h-[260px] max-h-[520px] overflow-hidden rounded-2xl md:rounded-[44px]">
          <Image src={activeLanc?.imagem_principal?.url || '/ribeirao-preto-bg.jpg'} alt={activeLanc?.title || 'Lançamento'} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
              <h3 className="text-white font-sans font-semibold text-lg sm:text-2xl md:text-3xl tracking-tight mb-1 md:mb-2">
                {activeLanc?.cidade ? `${activeLanc.cidade.nome} | ${activeLanc.cidade.estado}` : 'Ribeirão Preto | SP'}
              </h3>
              <p className="text-white/90 font-sans font-light text-xs sm:text-sm md:text-base tracking-tight max-w-xl leading-relaxed">
                {activeLanc?.descricao_curta || 'Em breve receberá novos lançamentos da virtú.'}
              </p>
            </div>
          </div>
          <button onClick={() => setLancIdx(p => p > 0 ? p - 1 : Math.max(0, destaques.length - 1))} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"><ChevronLeft className="w-5 h-5 md:w-7 md:h-7" strokeWidth={1.5} /></button>
          <button onClick={() => setLancIdx(p => p < Math.max(0, destaques.length - 1) ? p + 1 : 0)} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"><ChevronRight className="w-5 h-5 md:w-7 md:h-7" strokeWidth={1.5} /></button>
        </div>
      </section>
    </>
  );
}
