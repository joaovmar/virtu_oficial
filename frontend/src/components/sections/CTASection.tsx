'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

/**
 * CTA Section - Figma colors
 */

interface CTASectionProps {
  titulo?: string;
  botaoTexto?: string;
  botaoLink?: string;
}

export default function CTASection({
  titulo = 'Vamos conversar sobre o seu',
  botaoTexto = 'Conheça mais',
  botaoLink = '/contato',
}: CTASectionProps) {
  return (
    <section className="py-16 md:py-24 bg-virtu-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-sans text-[24px] md:text-[32px] text-virtu-dark font-extralight mb-2"
        >
          {titulo} <span className="font-display italic text-virtu-gold font-medium">futuro!</span>
        </motion.h2>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-8">
          <Link
            href={botaoLink}
            className="inline-block bg-virtu-green-dark hover:bg-virtu-green text-white font-sans font-light text-[16px] px-10 py-4 rounded-[38px] transition-colors"
          >
            {botaoTexto}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
