/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },
  images: {
    domains: [
      'images.unsplash.com',
      'k6hrqrxuu8obbfwn.public.blob.vercel-storage.com'
    ]
  },
  // Configuração para evitar problemas com variáveis de ambiente durante o build
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Configuração para otimizar o build
  swcMinify: true,
  // Configuração para evitar problemas com APIs durante o build
  generateBuildId: async () => {
    return 'yumix-build-' + Date.now()
  }
}

module.exports = nextConfig