'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { getConfiguracoes, ConfiguracaoSite } from '@/lib/api';
import ContactForm from '@/components/ui/ContactForm';

export default function ContatoPage() {
  const [config, setConfig] = useState<ConfiguracaoSite | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getConfiguracoes();
        setConfig(data);
      } catch (error) {
        console.error('Erro:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="bg-virtu-dark pt-24 md:pt-32 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl lg:text-5xl text-white text-center"
          >
            Fale Conosco
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-center mt-4 max-w-2xl mx-auto"
          >
            Estamos prontos para ajudar você a encontrar o imóvel ideal. Entre em contato conosco!
          </motion.p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Informações de Contato */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="font-display text-3xl text-virtu-dark mb-8">
                Vamos conversar sobre o seu <span className="text-virtu-gold italic">futuro!</span>
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-virtu-cream flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-virtu-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium text-virtu-dark mb-1">E-mail</h3>
                    <a
                      href={`mailto:${config?.email || 'contato@virtu.com.br'}`}
                      className="text-gray-600 hover:text-virtu-gold transition-colors"
                    >
                      {config?.email || 'contato@virtu.com.br'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-virtu-cream flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-virtu-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium text-virtu-dark mb-1">Telefone</h3>
                    <a
                      href={`tel:${(config?.telefone || '(11) 99999-9999').replace(/\D/g, '')}`}
                      className="text-gray-600 hover:text-virtu-gold transition-colors"
                    >
                      {config?.telefone || '(11) 99999-9999'}
                    </a>
                  </div>
                </div>

                {config?.whatsapp && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-virtu-cream flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-virtu-gold" />
                    </div>
                    <div>
                      <h3 className="font-medium text-virtu-dark mb-1">WhatsApp</h3>
                      <a
                        href={`https://wa.me/${config.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-virtu-gold transition-colors"
                      >
                        {config.whatsapp}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Horário de Atendimento */}
              <div className="mt-12 p-6 bg-virtu-cream rounded-2xl">
                <h3 className="font-medium text-virtu-dark mb-4">Horário de Atendimento</h3>
                <p className="text-gray-600 text-sm">
                  Segunda a Sexta: 9h às 18h<br />
                  Sábado: 9h às 13h
                </p>
              </div>
            </motion.div>

            {/* Formulário */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ContactForm title="Envie sua mensagem" />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
