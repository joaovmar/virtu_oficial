'use client';

import { motion } from 'framer-motion';

export default function BlogPage() {
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center pt-20 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-sans font-light text-2xl md:text-3xl text-virtu-dark mb-3">Blog</h1>
        <p className="font-display font-medium italic text-4xl md:text-5xl text-virtu-green mb-6">em breve</p>
        <p className="font-sans text-sm text-virtu-muted max-w-md">
          Estamos preparando conteúdos sobre o mercado imobiliário, dicas de decoração e novidades da virtú.
        </p>
      </motion.div>
    </section>
  );
}
