'use client';

import Image from 'next/image';
import Button from '@/components/ui/Button';

interface LeadCaptureSectionProps {
    titulo?: string;
    subtitulo?: string;
    imagemFundo?: string;
}

export default function LeadCaptureSection({
    titulo = "Casas sobrado na\nregião da Vila do Golfe\nem Ribeirão Preto - SP",
    subtitulo = "Breve lançamento",
    imagemFundo = "/vila-do-golfe-bg.jpg"
}: LeadCaptureSectionProps) {
    return (
        <section className="relative py-16 md:py-24 mb-10 mx-4 sm:mx-6 lg:mx-8 max-w-7xl xl:mx-auto rounded-3xl overflow-hidden shadow-2xl">
            <Image
                src={imagemFundo}
                alt="Fundo Lead"
                fill
                className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10 px-6 lg:px-16 py-12 flex flex-col md:flex-row gap-12 justify-between items-center">
                <div className="text-white md:w-1/2">
                    <span className="font-sans font-medium mb-2 block">{subtitulo}</span>
                    <h2 className="font-sans font-medium text-4xl lg:text-5xl mb-6 whitespace-pre-line">
                        {titulo}
                    </h2>
                    <div className="flex items-center gap-4 mt-8">
                        <Image src="/perplan-logo-white.svg" alt="Perplan" width={120} height={40} className="object-contain opacity-90" />
                        <Image src="/virtu-logo-white.svg" alt="Virtu" width={100} height={40} className="object-contain opacity-90" />
                    </div>
                </div>

                <div className="md:w-[450px] w-full">
                    <div className="bg-transparent text-white border-0">
                        <h3 className="font-sans font-bold text-2xl mb-6">Cadastre-se e saiba mais!</h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nome*</label>
                                <input type="text" placeholder="Nome completo" className="w-full px-4 py-3 rounded-full text-virtu-dark bg-white focus:outline-none focus:ring-2 focus:ring-virtu-gold" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">E-mail*</label>
                                <input type="email" placeholder="E-mail" className="w-full px-4 py-3 rounded-full text-virtu-dark bg-white focus:outline-none focus:ring-2 focus:ring-virtu-gold" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Telefone*</label>
                                <input type="tel" placeholder="Telefone com DDD" className="w-full px-4 py-3 rounded-full text-virtu-dark bg-white focus:outline-none focus:ring-2 focus:ring-virtu-gold" />
                            </div>
                            <Button type="button" className="w-full bg-virtu-green hover:bg-virtu-teal-light !text-sm !py-3 rounded-full text-white font-medium mt-2">
                                Fale com um especialista
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
