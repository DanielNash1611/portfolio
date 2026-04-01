/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unavatar.io",
      },
    ],
  },
  eslint: {
    dirs: ["app", "components", "lib", "data", "content"],
  },
  async redirects() {
    return [
      {
        source: "/work/sound-synthesist",
        destination: "/work/ai-platform-mcp#sound-seeker-live-demo",
        permanent: true,
      },
      {
        source: "/music",
        destination: "/creative/compositions",
        permanent: true,
      },
      {
        source: "/products/chatgpt-contact-center",
        destination: "/work/chatgpt-enterprise",
        permanent: true,
      },
      {
        source: "/products/chatgpt-org-scale",
        destination: "/work/ai-platform-mcp",
        permanent: true,
      },
      {
        source: "/work/oms-transformation",
        destination: "/work/checkout-redesign",
        permanent: true,
      },
      {
        source: "/work/sound-seeker",
        destination: "/work/ai-platform-mcp#sound-seeker-live-demo",
        permanent: true,
      },
      {
        source: "/products/ai-agents-lab",
        destination: "/products/oms-chatgpt-app",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
