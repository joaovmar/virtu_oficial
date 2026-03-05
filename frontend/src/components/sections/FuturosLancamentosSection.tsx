'use client';

import Image from 'next/image';

interface FuturoLancamentoItem {
    id: number;
    titulo: string;
    texto: string;
    imagem: string;
}

interface FuturosLancamentosProps {
    titulo?: string;
    subtitulo?: string;
    itens?: FuturoLancamentoItem[];
}

export default function FuturosLancamentosSection({
    titulo = "lançamentos",
    subtitulo = "Futuros",
    itens = [
        {
            id: 1,
            titulo: "Ribeirão Preto | SP",
            texto: "Ribeirão Preto, cidade que pulsa crescimento e qualidade de vida, em breve receberá novos lançamentos da virtú, pensados para acompanhar o ritmo e o potencial da região.",
            imagem: "/ribeirao-preto-bg.jpg"
        }
    ]
}: FuturosLancamentosProps) {
    if (!itens || itens.length === 0) return null;

    // In a real implementation this would manage state for active slide
    const activeItem = itens[0];

    return (
        <section className="py-16 md:py-24 bg-white text-center">
            <h2 className="font-sans text-xl uppercase tracking-[0.2em] text-gray-500 mb-[-10px]">{subtitulo}</h2>
            <h2 className="font-display text-5xl md:text-6xl italic text-virtu-teal mb-16">{titulo}</h2>

            <div className="relative w-full h-[600px] overflow-hidden group">
                <Image src={activeItem.imagem} alt={activeItem.titulo} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-12 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left text-white z-10">
                    <h3 className="font-sans font-semibold text-4xl mb-3">{activeItem.titulo}</h3>
                    <p className="max-w-2xl font-light text-lg opacity-90 leading-relaxed" dangerouslySetInnerHTML={{ __html: activeItem.texto }} />
                </div>

                {itens.length > 1 && (
                    <>
                        {/* simple arrows for placeholder */}
                        <div className="absolute top-1/2 -translate-y-1/2 left-8 w-12 h-12 flex items-center justify-center cursor-pointer text-white/50 hover:text-white transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                        </div>
                        <div className="absolute top-1/2 -translate-y-1/2 right-8 w-12 h-12 flex items-center justify-center cursor-pointer text-white/50 hover:text-white transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                        </div>

                        {/* simple dots placeholder */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                            {itens.map((_, i) => (
                                <div key={i} className={`w-2.5 h-2.5 rounded-full bg-white cursor-pointer ${i === 0 ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
