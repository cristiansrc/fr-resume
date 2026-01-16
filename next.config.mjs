/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Temporalmente comentado para generar opengraph-image
  // Descomenta después de generar la imagen y cópiala a /public/images/og-image.png
  // output: "export",
  trailingSlash: true,
};

export default nextConfig;
