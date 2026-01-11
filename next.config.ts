import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    authPersistSession: true,
    typedRoutes: true,
    optimizePackageImports: ["lucide-react"],
  }, images: {
    domains: ['cf.bstatic.com'], // السماح بعرض الصور من هذا الدومين
  },
  typescript: {
    ignoreBuildErrors: true, // يتجاهل كل أخطاء TypeScript أثناء build
  },
};

export default nextConfig;
