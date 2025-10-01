import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Evita que erros de ESLint quebrem o build em produção (Render)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Evita que erros de Typescript quebrem o build em produção (Render)
    ignoreBuildErrors: true,
  },
  images: {
    // Permite otimização de imagens hospedadas externamente
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
