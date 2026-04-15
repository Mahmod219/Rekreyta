/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eymnzcnoamfdyrcabnzz.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // دمجنا كل شي جوا experimental واحد عشان ما يصير تضارب
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
    // ملاحظة: إذا كنت تستخدم إصدار 15+ التيربو غالباً ما يحتاج إعدادات هنا
  },

  turbopack: {},

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        child_process: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
