'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import api from '@/lib/api';

export interface TrackingConfig {
  gtm_ativo?: boolean;
  gtm_container_id?: string;
  rdstation_ativo?: boolean;
  rdstation_public_token?: string;
  meta_pixel_ativo?: boolean;
  meta_pixel_id?: string;
  ga4_ativo?: boolean;
  ga4_measurement_id?: string;
}

/**
 * TrackingScripts - Injeta scripts de tracking baseado nas configurações do Wagtail.
 *
 * SEGURANÇA:
 * - Busca apenas IDs públicos via /api/v1/tracking/ (endpoint seguro)
 * - O rdstation_api_token NUNCA é retornado pela API
 * - rdstation_public_token é seguro para uso no frontend (tracking JS apenas)
 * - GTM Container ID, Meta Pixel ID e GA4 Measurement ID são públicos por natureza
 */
export default function TrackingScripts() {
  const [config, setConfig] = useState<TrackingConfig | null>(null);

  useEffect(() => {
    // AbortController para prevenir Memory Leaks caso o componente desmonte
    const controller = new AbortController();

    const fetchConfig = async () => {
      try {
        // Tipagem estrita amarrada diretamente na resposta do Axios/Fetch
        const res = await api.get<TrackingConfig>('/tracking/', {
          signal: controller.signal,
        });
        setConfig(res.data);
      } catch (error: any) {
        // Ignora erros de cancelamento de requisição (comportamento esperado no cleanup)
        if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
          console.error('TrackingScripts: Falha ao carregar configurações de tracking.', error);
        }
      }
    };

    fetchConfig();

    // Cleanup function: cancela a requisição pendente se o componente sair da tela
    return () => {
      controller.abort();
    };
  }, []);

  // Early return para não renderizar nada enquanto não temos o config
  if (!config) return null;

  return (
    <>
      {/* GTM */}
      {config.gtm_ativo && config.gtm_container_id && (
        <>
          <Script
            id="gtm-head"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${config.gtm_container_id}');
              `,
            }}
          />
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${config.gtm_container_id}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      )}

      {/* RD Station Tracking (token PÚBLICO — seguro para frontend) */}
      {config.rdstation_ativo && config.rdstation_public_token && (
        <Script
          id="rdstation-tracking"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var rdForms = document.createElement('script');
                rdForms.type = 'text/javascript';
                rdForms.async = true;
                rdForms.src = 'https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js';
                document.head.appendChild(rdForms);

                var rdAnalytics = document.createElement('script');
                rdAnalytics.type = 'text/javascript';
                rdAnalytics.async = true;
                rdAnalytics.src = 'https://d335luupugsy2.cloudfront.net/js/loader-scripts/${config.rdstation_public_token}-loader.js';
                document.head.appendChild(rdAnalytics);
              })();
            `,
          }}
        />
      )}

      {/* Meta Pixel (Facebook/Instagram) */}
      {config.meta_pixel_ativo && config.meta_pixel_id && (
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${config.meta_pixel_id}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}

      {/* GA4 (Google Analytics 4) */}
      {config.ga4_ativo && config.ga4_measurement_id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${config.ga4_measurement_id}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-config"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${config.ga4_measurement_id}');
              `,
            }}
          />
        </>
      )}
    </>
  );
}