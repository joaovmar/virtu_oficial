'use client';

import { motion } from 'framer-motion';

export default function PoliticaPrivacidadePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 sm:py-28 md:py-36 lg:py-40 bg-virtu-dark">
        <div className="absolute inset-0 bg-gradient-to-r from-virtu-green-dark/90 to-virtu-green-dark/80" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="font-sans font-bold text-[24px] sm:text-[30px] lg:text-[36px] text-white mb-2 md:mb-3 leading-snug"
          >
            Política de Privacidade
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-white/80 font-sans font-light text-[13px] md:text-[16px]"
          >
            Entenda como cuidamos dos seus dados com segurança e transparência.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-sm md:prose-base prose-virtu max-w-none text-virtu-dark font-sans leading-relaxed"
          >
            <p>
              A virtú leva a sua privacidade muito a sério. Esta página está em fase de estruturação e em breve conterá todos os detalhes sobre como coletamos, usamos, armazenamos e protegemos as suas informações pessoais, em total conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>
            <p>
              Caso tenha dúvidas imediatas sobre como tratamos seus dados, por favor, entre em contato através de nossa página de <strong>Contato</strong>.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
