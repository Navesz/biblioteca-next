/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  // Configurações adicionais do Next.js
  env: {
    APP_NAME: 'Biblioteca IEPMM',
    APP_DESCRIPTION: 'Sistema de gerenciamento de biblioteca desenvolvido com Next.js, MongoDB e Docker',
  },
};

module.exports = nextConfig;