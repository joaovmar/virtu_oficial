'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getEmpreendimentos, getCidades, getEmpreendimentosConfig, EmpreendimentoCard as EmpCard, Cidade, EmpreendimentosIndexConfig } from '@/lib/api';
import EmpreendimentoCard from '@/components/ui/EmpreendimentoCard';
import ContactForm from '@/components/ui/ContactForm';
import FuturosLancamentosSection from '@/components/sections/FuturosLancamentosSection';

export default function EmpreendimentosPage() {
  const [empreendimentos, setEmpreendimentos] = useState<EmpCard[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [pageConfig, setPageConfig] = useState<EmpreendimentosIndexConfig | null>(null);
  const [cidadeAtiva, setCidadeAtiva] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { async function f() { try {
    const [e, c, cfg] = await Promise.all([getEmpreendimentos().catch(() => []), getCidades().catch(() => []), getEmpreendimentosConfig().catch(() => null)]);
    setEmpreendimentos(Array.isArray(e) ? e : []); setCidades(Array.isArray(c) ? c : []); setPageConfig(cfg);
  } catch {} finally { setLoading(false); } } f(); }, []);

  const handleFilter = async (id: number | null) => {
    setCidadeAtiva(id); setLoading(true);
    try { const e = await getEmpreendimentos(id ? { cidade: id } : undefined); setEmpreendimentos(Array.isArray(e) ? e : []); }
    catch {} finally { setLoading(false); }
  };

  return (
    <>
      {/* 1. HERO — Card arredondado com margens, igual ao Figma */}
      <section className="relative pt-20 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mx-3 sm:mx-6 md:mx-10 lg:mx-14 rounded-2xl md:rounded-[44px] overflow-hidden"
          style={{ minHeight: 'clamp(340px, 52vh, 580px)' }}
        >
          <Image
            src={pageConfig?.hero_imagem?.url || '/vila-do-golfe-bg.jpg'}
            alt="Empreendimento"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[rgba(15,25,20,0.65)]" />

          <div className="relative z-10 h-full flex items-center px-6 sm:px-10 md:px-14 py-10 md:py-14">
            <div className="w-full flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">

              {/* Texto esquerdo */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="text-white text-center lg:text-left"
              >
                {pageConfig?.banner_label && (
                  <span className="font-sans font-normal text-xs md:text-sm tracking-tight mb-2 block opacity-90">
                    {pageConfig.banner_label}
                  </span>
                )}
                {pageConfig?.banner_texto && (
                  <h1 className="font-sans font-light text-[24px] sm:text-[28px] md:text-[30px] lg:text-[32px] leading-tight mb-6 md:mb-8 whitespace-pre-line">
                    {pageConfig.banner_texto}
                  </h1>
                )}
                {(pageConfig?.banner_logo_parceiro || pageConfig?.banner_logo_virtu) && (
                  <div className="flex items-center justify-center lg:justify-start gap-4 md:gap-6">
                    {pageConfig.banner_logo_parceiro && (
                      <Image src={pageConfig.banner_logo_parceiro.url} alt="Parceiro" width={160} height={65}
                        className="object-contain h-[32px] sm:h-[40px] md:h-[52px] w-auto" />
                    )}
                    {pageConfig.banner_logo_virtu && (
                      <Image src={pageConfig.banner_logo_virtu.url} alt="virtú" width={85} height={34}
                        className="object-contain h-[18px] sm:h-[22px] md:h-[30px] w-auto" />
                    )}
                  </div>
                )}
              </motion.div>

              {/* Formulário direito */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="w-full max-w-[420px] mx-auto lg:mx-0 lg:ml-auto"
              >
                <ContactForm
                  title="Cadastre-se e saiba mais!"
                  className="bg-transparent [&_label]:text-white [&_h3]:text-white [&_h3]:text-xl [&_h3]:text-center [&_h3]:mb-5"
                />
              </motion.div>

            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. GRID — começa logo abaixo do hero sem espaço excessivo */}
      <section className="py-10 md:py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            {cidades.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6 md:mb-8 justify-center">
                <button onClick={() => handleFilter(null)} className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-sans font-semibold ${cidadeAtiva === null ? 'bg-virtu-gold text-white' : 'bg-white text-virtu-text border border-virtu-border hover:border-virtu-gold'}`}>Todos</button>
                {cidades.map((c) => (
                  <button key={c.id} onClick={() => handleFilter(c.id)} className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-sans font-semibold ${cidadeAtiva === c.id ? 'bg-virtu-gold text-white' : 'bg-white text-virtu-text border border-virtu-border hover:border-virtu-gold'}`}>{c.nome}</button>
                ))}
              </div>
            )}
          </motion.div>
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

      {/* 3. Futuros lançamentos — componente unificado */}
      <FuturosLancamentosSection />
    </>
  );
}
