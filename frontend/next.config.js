/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    // AVIF primeiro: navegador que suporta recebe um arquivo menor que WebP na
    // mesma qualidade visual; quem não suporta cai pro próximo da lista automaticamente.
    formats: ['image/avif', 'image/webp'],
    // Default do Next é 60s — baixíssimo pra imagens institucionais que raramente
    // mudam. Aumenta o tempo que a variante já otimizada fica em cache (servidor
    // e navegador) sem alterar a imagem/qualidade servida.
    minimumCacheTTL: 2678400, // 31 dias
    remotePatterns: [
      { protocol: 'https', hostname: 'virtuincorp.com.br', pathname: '/**' },
      { protocol: 'https', hostname: 'www.virtuincorp.com.br', pathname: '/**' },
      { protocol: 'https', hostname: 'virtu.com.br', pathname: '/**' },
      { protocol: 'https', hostname: 'www.virtu.com.br', pathname: '/**' },
      { protocol: 'http',  hostname: 'localhost',    pathname: '/**' },
      { protocol: 'http',  hostname: '127.0.0.1',    pathname: '/**' },
      ...(process.env.NEXT_PUBLIC_MEDIA_HOSTS || '').split(',').filter(Boolean).map(h => ({
        protocol: 'https', hostname: h.trim(), pathname: '/**'
      })),
    ],
  },
  experimental: {
    // Reduz o que é incluído no bundle do cliente para essas libs, sem mudar
    // nenhum comportamento/import já usado no código.
    optimizePackageImports: ['lucide-react', 'framer-motion'],
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
