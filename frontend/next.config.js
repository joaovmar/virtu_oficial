/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'brio-staging-web.com.br', pathname: '/**' },
      { protocol: 'http',  hostname: 'brio-staging-web.com.br', pathname: '/**' },
      { protocol: 'https', hostname: 'virtu.com.br', pathname: '/**' },
      { protocol: 'https', hostname: 'www.virtu.com.br', pathname: '/**' },
      { protocol: 'http',  hostname: 'localhost',    pathname: '/**' },
      { protocol: 'http',  hostname: '127.0.0.1',    pathname: '/**' },
      ...(process.env.NEXT_PUBLIC_MEDIA_HOSTS || '').split(',').filter(Boolean).map(h => ({
        protocol: 'https', hostname: h.trim(), pathname: '/**'
      })),
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net https://www.google-analytics.com",
              "frame-src 'self' https://maps.google.com https://www.google.com https://www.youtube.com https://youtube.com",
              "img-src * data: blob:",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src *",
            ].join('; '),
          },
        ],
      },
    ];
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
