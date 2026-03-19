/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: false, // Disable Turbopack to avoid React static flag errors
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aedqlcfjrehmghafbdun.supabase.co",
      },
    ],
  },
};


export default nextConfig;
