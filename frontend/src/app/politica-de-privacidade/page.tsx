'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

interface PoliticaData {
  titulo: string;
  ultima_atualizacao: string | null;
  conteudo: string;
}

const CONTEUDO_FALLBACK = `
<h2>Política de Privacidade e Termos de Uso – Virtu Incorporadora LTDA</h2>
<p><strong>Atualização: 11/06/2026</strong></p>
<p>Sua privacidade é importante para a Virtu Incorporadora Ltda. Por esta razão, esta Política de Privacidade tem por objetivo informar, de forma transparente, como coletamos, utilizamos, armazenamos, compartilhamos e protegemos os seus dados pessoais, bem como os direitos que você, na qualidade de titular, possui.</p>
<p>Esta Política foi elaborada em conformidade com a Lei Federal nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais – LGPD), a Lei Federal nº 12.965/2014 (Marco Civil da Internet), a Lei Federal nº 8.078/1990 (Código de Defesa do Consumidor) e as demais normas aplicáveis, inclusive as resoluções e orientações editadas pela Autoridade Nacional de Proteção de Dados (ANPD).</p>

<h2>Identificação do Controlador</h2>
<p><strong>Controlador dos dados pessoais:</strong> Virtu Incorporadora LTDA, sociedade empresária limitada, com sede na cidade de Ribeirão Preto, na Avenida Sumaré, nº 372, Bairro Jardim Sumaré, Cidade de Ribeirão Preto, Estado de São Paulo, CEP 14025-450, devidamente inscrita no CNPJ sob nº 60.610.806/0001-23 ("Virtú Incorporação e Urbanismo", "Virtú" ou "nós").</p>
<p><strong>Encarregado pelo Tratamento de Dados Pessoais (DPO):</strong> MATEUS RAGOZONI. Contato: dados@brioincorporadora.com.br</p>

<h2>1 – Coleta dos seus dados pessoais</h2>
<p>Coletamos dados pessoais a partir das suas interações conosco, pelo site, blog ou aplicativos (app) da Virtú Incorporação e Urbanismo, especialmente quando você acessa nossas plataformas, cria login e senha ou realiza cadastro. Nesse processo, podemos coletar:</p>
<ul>
<li>Nome completo;</li>
<li>Data de nascimento;</li>
<li>Número e imagem da Carteira de Identidade (RG) e/ou Passaporte (se estrangeiro);</li>
<li>Número e imagem do Cadastro de Pessoas Físicas (CPF);</li>
<li>Número e imagem da Carteira Nacional de Habilitação (CNH);</li>
<li>Estado civil;</li>
<li>Nível de instrução ou escolaridade;</li>
<li>Endereço completo;</li>
<li>Números de telefone, WhatsApp e endereços de e-mail;</li>
<li>Banco, agência e número de contas bancárias;</li>
<li>Informações do seu FGTS;</li>
<li>Vínculo empregatício.</li>
</ul>
<p>Também coletamos dados de navegação por meio de cookies e tecnologias semelhantes, conforme a seção 2. Todos os dados são utilizados de acordo com as finalidades e as bases legais declaradas nesta Política.</p>

<h2>2 – Cookies e tecnologias de rastreamento</h2>
<h3>O que são cookies</h3>
<p>Cookies são arquivos-texto gerados pelo site e pelo blog da Virtú Incorporação e Urbanismo e armazenados no seu dispositivo pelos programas de navegação ("browsers"). Em geral, são utilizados para otimizar a sua experiência de navegação, identificando tendências de uso, como páginas visitadas ou links clicados, para aprimorar e personalizar seus acessos futuros. Os cookies que utilizamos não executam programas nem inserem vírus ou programas maliciosos em seu dispositivo.</p>

<h3>Como a Virtú Incorporação e Urbanismo usa os cookies</h3>
<p>Os cookies utilizados em nossas plataformas atendem aos requisitos legais e enquadram-se nas seguintes categorias:</p>

<h4>Cookies estritamente necessários</h4>
<p>Permitem que você navegue e utilize recursos essenciais, como áreas seguras. Não armazenam informações utilizáveis em ações de comunicação de produtos ou serviços. Nós os usamos para:</p>
<ul>
<li>Identificá-lo como usuário conectado ao site virtuincorp.com.br;</li>
<li>Lembrar informações digitadas previamente em formulários, para pré-registro;</li>
<li>Garantir que você se conecte ao serviço correto quando houver alguma mudança em seu funcionamento.</li>
</ul>

<h4>Cookies de desempenho</h4>
<p>Coletam informações sobre como você usa nosso site (por exemplo, páginas visitadas e erros em formulários), de forma anônima e codificada, para melhorar o funcionamento do site e medir a eficácia da nossa comunicação. Nós os usamos para:</p>
<ul>
<li>Fornecer estatísticas sobre a utilização do site;</li>
<li>Verificar a eficiência da nossa comunicação, sem direcionamento de anúncios em outros sites;</li>
<li>Identificar e corrigir erros e aperfeiçoar o site com base no comportamento de navegação.</li>
</ul>

<h4>Cookies de funcionalidade</h4>
<p>São usados para fornecer serviços e lembrar definições de navegação, de modo a melhorar a sua visita. Nós os usamos para:</p>
<ul>
<li>Lembrar configurações aplicadas por você (layout, tamanho de texto, preferências e cores);</li>
<li>Lembrar se você já foi convidado a responder a uma pesquisa, evitando repetições;</li>
<li>Compartilhar informações com parceiros apenas para oferecer o serviço, produto ou função solicitado, e não para outra finalidade.</li>
</ul>

<h4>Cookies de segmentação</h4>
<p>Estão ligados a serviços de terceiros (por exemplo, botões de "curtir" e de "compartilhar" de redes sociais). O terceiro reconhece que você visitou nosso site, mas não se confunde com a Virtú Incorporadora. Nós os usamos para:</p>
<ul>
<li>Vincular sua atividade às redes sociais ou plataformas de anúncio;</li>
<li>Permitir que parceiros de publicidade saibam se você acessou nosso site após ver um anúncio.</li>
</ul>
`;

export default function PoliticaPrivacidadePage() {
  const [data, setData] = useState<PoliticaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/politica-privacidade/')
      .then(r => {
        const d = r.data;
        if (d?.conteudo) {
          d.conteudo = d.conteudo.replace(/ data-block-key="[^"]*"/g, '');
        }
        setData(d);
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-virtu-gold border-t-transparent" />
      </div>
    );
  }

  const titulo = data?.titulo || 'Política de Privacidade';
  const conteudo = data?.conteudo || CONTEUDO_FALLBACK;
  const ultimaAtualizacao = data?.ultima_atualizacao;

  return (
    <main className="pt-24 pb-16 md:pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <h1 className="font-sans font-bold text-[28px] sm:text-[36px] md:text-[42px] text-virtu-dark mb-2 leading-tight">
            {titulo}
          </h1>
          {ultimaAtualizacao && (
            <p className="text-virtu-muted font-sans text-[13px] mb-10">
              Última atualização:{' '}
              {new Date(ultimaAtualizacao).toLocaleDateString('pt-BR', {
                day: '2-digit', month: 'long', year: 'numeric'
              })}
            </p>
          )}
          <div
            className="
              font-sans text-virtu-dark
              [&_h1]:font-bold [&_h1]:text-virtu-dark [&_h1]:text-2xl [&_h1]:mt-10 [&_h1]:mb-4
              [&_h2]:font-bold [&_h2]:text-virtu-dark [&_h2]:text-xl [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:border-b [&_h2]:border-virtu-gold/30 [&_h2]:pb-2
              [&_h3]:font-semibold [&_h3]:text-virtu-green [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2
              [&_h4]:font-semibold [&_h4]:text-virtu-dark [&_h4]:text-base [&_h4]:mt-5 [&_h4]:mb-2
              [&_p]:text-[14px] [&_p]:leading-relaxed [&_p]:mb-4
              [&_ul]:pl-5 [&_ul]:mb-4 [&_ul>li]:text-[14px] [&_ul>li]:mb-1.5 [&_ul>li]:leading-relaxed
              [&_ol]:pl-5 [&_ol]:mb-4 [&_ol>li]:text-[14px] [&_ol>li]:mb-1.5
              [&_a]:text-virtu-green [&_a]:underline [&_a]:underline-offset-2
              [&_strong]:font-semibold
            "
            dangerouslySetInnerHTML={{ __html: conteudo }}
          />
        </motion.div>
      </div>
    </main>
  );
}
