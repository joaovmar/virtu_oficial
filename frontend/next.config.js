/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    // Aceita imagens de qualquer hostname (NEXT_PUBLIC_MEDIA_HOSTS) + defaults conhecidos
    // Em prod: backend serve /media/* via rewrite do Next.js (sem hostname externo)
    // Em dev: imagens vêm de 127.0.0.1:8000 diretamente
    remotePatterns: [
      { protocol: 'https', hostname: 'brio-staging-web.com.br', pathname: '/**' },
      { protocol: 'http',  hostname: 'brio-staging-web.com.br', pathname: '/**' },
      { protocol: 'https', hostname: 'virtu.com.br', pathname: '/**' },
      { protocol: 'https', hostname: 'www.virtu.com.br', pathname: '/**' },
      { protocol: 'http',  hostname: 'localhost',    pathname: '/**' },
      { protocol: 'http',  hostname: '127.0.0.1',    pathname: '/**' },
      // Hosts extras via env (ex: NEXT_PUBLIC_MEDIA_HOSTS=meu-servidor.com,cdn.meu-servidor.com)
      ...(process.env.NEXT_PUBLIC_MEDIA_HOSTS || '').split(',').filter(Boolean).map(h => ({
        protocol: 'https', hostname: h.trim(), pathname: '/**'
      })),
    ],
    // Permitir URLs relativas (/media/...) quando servidas pelo proxy Next.js
    unoptimized: false,
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_INTERNAL_URL || 'http://backend:8000';
    return [
      { source: '/api/:path*',   destination: `${backendUrl}/api/:path*` },
      { source: '/media/:path*', destination: `${backendUrl}/media/:path*` },
    ];
  },
}
module.exports = nextConfig
