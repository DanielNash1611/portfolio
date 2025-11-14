/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unavatar.io"
      }
    ]
  },
  eslint: {
    dirs: ["app", "components", "lib", "data"]
  },
  async redirects() {
    return [
      {
        source: "/work/sound-synthesist",
        destination: "/work/sound-seeker",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
