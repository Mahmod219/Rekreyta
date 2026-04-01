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
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // 🔥 مهم لرفع الصور والـ CV
    },
  },
};

export default nextConfig;
