/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
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
  async rewrites() {
    const backendUrl = process.env.BACKEND_INTERNAL_URL || 'http://backend:8000';
    return [
      { source: '/api/:path*',   destination: `${backendUrl}/api/:path*` },
      { source: '/media/:path*', destination: `${backendUrl}/media/:path*` },
    ];
  },
}
module.exports = nextConfig
