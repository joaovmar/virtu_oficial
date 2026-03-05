'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Bed, Maximize, Car } from 'lucide-react';
import { getEmpreendimento, EmpreendimentoDetalhe } from '@/lib/api';
import ContactForm from '@/components/ui/ContactForm';
import FuturosLancamentosSection from '@/components/sections/FuturosLancamentosSection';
import LeadCaptureSection from '@/components/sections/LeadCaptureSection';

export default function EmpreendimentoDetalhePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [emp, setEmp] = useState<EmpreendimentoDetalhe | null>(null);
  const [loading, setLoading] = useState(true);
  const [plantaAtiva, setPlantaAtiva] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getEmpreendimento(slug);
        setEmp(data);
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-virtu-gold border-t-transparent" />
      </div>
    );
  }

  if (!emp) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <h1 className="font-display text-3xl text-virtu-dark mb-4">Empreendimento não encontrado</h1>
      </div>
    );
  }

  return (
    <>
      {/* 1. Hero Section com Form */}
      <section className="relative h-screen min-h-[700px] flex items-center pt-20 pb-12">
        <div className="absolute inset-0 z-0">
          {emp.imagem_hero ? (
            <Image
              src={emp.imagem_hero.url}
              alt={emp.imagem_hero.alt || emp.title}
              fill
              className="object-cover"
              priority
            />
          ) : emp.imagem_principal ? (
            <Image
              src={emp.imagem_principal.url}
              alt={emp.imagem_principal.alt || emp.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-virtu-dark to-virtu-teal" />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row gap-12 justify-between items-center h-full">
          {/* Esquerda: Textos Hero */}
          <div className="text-white lg:w-1/2 mt-12 lg:mt-0">
            {emp.logo && (
              <Image
                src={emp.logo.url}
                alt={emp.logo.alt || emp.title}
                width={280}
                height={100}
                className="object-contain mb-8 filter brightness-0 invert"
              />
            )}
            <h1 className="font-display text-4xl lg:text-6xl text-white mb-2 leading-tight">
              {emp.title}
            </h1>
            {(emp.bairro || emp.cidade) && (
              <p className="font-sans font-medium text-lg lg:text-xl uppercase tracking-widest text-virtu-gold mb-6">
                {[emp.bairro, `${emp.cidade?.nome || 'Ribeirão Preto'} - ${emp.cidade?.estado || 'SP'}`].filter(Boolean).join(' | ')}
              </p>
            )}
            <h2 className="font-display text-3xl lg:text-5xl italic font-light opacity-90 max-w-xl">
              {emp.subtitulo || "Perto de tudo que inspira você."}
            </h2>
          </div>

          {/* Direita: Form */}
          <div className="lg:w-[450px] w-full">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h3 className="text-white font-sans font-bold text-2xl mb-6 text-center">Saiba mais!</h3>
              <ContactForm empreendimentoId={emp.id} className="[&_label]:text-white [&_input]:bg-white/80 [&_button]:mt-4" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Galeria: Detalhes que inspiram */}
      {emp.galeria_imagens && emp.galeria_imagens.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-5xl text-virtu-green mb-16">
              Detalhes que <span className="italic">inspiram</span>
            </h2>

            {/* Simple Grid Placeholder matching mockup layout - 1 large left, 2 stacked right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px]">
              <div className="relative rounded-2xl overflow-hidden shadow-lg h-full">
                <Image src={emp.galeria_imagens[0]?.imagem?.url || '/placeholder.jpg'} alt="Galeria 1" fill className="object-cover" />
              </div>
              <div className="flex flex-col gap-4 h-full">
                <div className="relative rounded-2xl overflow-hidden shadow-lg flex-1">
                  {emp.galeria_imagens[1]?.imagem && (
                    <Image src={emp.galeria_imagens[1].imagem.url} alt="Galeria 2" fill className="object-cover" />
                  )}
                </div>
                <div className="relative rounded-2xl overflow-hidden shadow-lg flex-1">
                  {emp.galeria_imagens[2]?.imagem && (
                    <Image src={emp.galeria_imagens[2].imagem.url} alt="Galeria 3" fill className="object-cover" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Planta Humanizada */}
      {emp.plantas && emp.plantas.length > 0 && (
        <section className="py-16 md:py-24 bg-virtu-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="font-sans font-medium uppercase tracking-[0.2em] text-gray-500">Conheça nossa</span>
              <h2 className="font-display text-5xl md:text-6xl text-virtu-green">
                planta <span className="italic text-virtu-gold">humanizada!</span>
              </h2>
            </div>

            {/* Tabs de plantas */}
            <div className="flex justify-center gap-2 mb-12 flex-wrap max-w-max mx-auto bg-white p-2 rounded-full shadow-sm">
              {emp.plantas.map((planta, index) => (
                <button
                  key={planta.id}
                  onClick={() => setPlantaAtiva(index)}
                  className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${plantaAtiva === index
                    ? 'bg-virtu-gold text-white shadow-md'
                    : 'text-gray-500 hover:text-virtu-dark'
                    }`}
                >
                  {planta.nome}
                </button>
              ))}
            </div>

            {/* Conteúdo da planta */}
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/3 flex flex-col gap-8">
                {emp.plantas[plantaAtiva]?.metragem && (
                  <div className="flex items-center gap-4 text-virtu-green">
                    <Maximize className="w-8 h-8 opacity-70" />
                    <span className="font-sans font-medium text-4xl">{emp.plantas[plantaAtiva].metragem}m²</span>
                  </div>
                )}
                {emp.plantas[plantaAtiva]?.dormitorios && (
                  <div className="flex items-center gap-4 text-virtu-green whitespace-pre-line">
                    <Bed className="w-8 h-8 opacity-70" />
                    <span className="font-sans font-medium text-3xl">{emp.plantas[plantaAtiva].dormitorios}</span>
                  </div>
                )}
                {emp.plantas[plantaAtiva]?.caracteristicas?.some(c => c.toLowerCase().includes('vaga')) && (
                  <div className="flex items-center gap-4 text-virtu-green">
                    <Car className="w-8 h-8 opacity-70" />
                    <span className="font-sans font-medium text-3xl">
                      {emp.plantas[plantaAtiva].caracteristicas.find(c => c.toLowerCase().includes('vaga'))}
                    </span>
                  </div>
                )}
              </div>

              <div className="lg:w-2/3 w-full">
                {emp.plantas[plantaAtiva]?.imagem ? (
                  <motion.div
                    key={plantaAtiva}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full h-[500px]"
                  >
                    <Image
                      src={emp.plantas[plantaAtiva].imagem!.url}
                      alt={emp.plantas[plantaAtiva].imagem!.alt || emp.plantas[plantaAtiva].nome}
                      fill
                      className="object-contain"
                    />
                  </motion.div>
                ) : (
                  <div className="w-full h-[500px] bg-white/50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
                    <span className="text-gray-400">Imagem da planta não disponível</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Localização */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-virtu-cream flex items-center justify-center mb-6 shadow-sm">
            <MapPin className="w-8 h-8 text-virtu-gold" />
          </div>
          <h2 className="font-display text-5xl text-virtu-dark mb-4">Localização</h2>
          <p className="text-xl font-light text-gray-500 mb-12 uppercase tracking-wide">
            {emp.bairro ? `Região da ${emp.bairro}` : 'Localização privilegiada'} - {emp.cidade?.nome || 'Ribeirão Preto'} / {emp.cidade?.estado || 'SP'}
          </p>

          <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
            <Image src="/map-placeholder.jpg" alt="Mapa" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* 5. Viva o extraordinário */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image src="/extraordinario-bg.jpg" alt="Viva o extraordinário" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <h2 className="relative z-10 font-display text-5xl md:text-7xl text-white italic">
          Viva o <span className="font-medium text-virtu-gold">extraordinário.</span>
        </h2>
      </section>

      {/* 6. Futuros Lançamentos */}
      <FuturosLancamentosSection />

      {/* 7. Lead Capture */}
      <div className="bg-curved-green py-16 md:py-24 -mt-16 pt-24 md:pt-32">
        <LeadCaptureSection
          titulo={`${emp.title}\n${emp.cidade?.nome || ''} - ${emp.cidade?.estado || ''}`}
          imagemFundo={emp.imagem_hero?.url || emp.imagem_principal?.url}
        />
      </div>
    </>
  );
}
