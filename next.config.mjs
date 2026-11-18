import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
  outputFileTracingIncludes: {
    "/api/portfolio-copilot": ["./content/search-index/portfolio.json"],
    "/api/portfolio-copilot/*": ["./content/search-index/portfolio.json"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unavatar.io",
      },
    ],
  },
  async redirects() {
    return [
      // Lossless delivery derivatives; original files remain in source-assets.
      ...[
  {
    "source": "/images/farraginous/emotiv-kit-fixed.png",
    "destination": "/images/farraginous/emotiv-kit-fixed.webp",
    "permanent": true
  },
  {
    "source": "/images/farraginous/emotiv-portrait-fixed.png",
    "destination": "/images/farraginous/emotiv-portrait-fixed.webp",
    "permanent": true
  },
  {
    "source": "/images/chatgpt-enterprise/hero-operating-model.png",
    "destination": "/images/chatgpt-enterprise/hero-operating-model.webp",
    "permanent": true
  },
  {
    "source": "/images/chatgpt-enterprise/enterprise-ai-operating-model.png",
    "destination": "/images/chatgpt-enterprise/enterprise-ai-operating-model.webp",
    "permanent": true
  },
  {
    "source": "/images/chatgpt-enterprise/grassroots-champions-model.png",
    "destination": "/images/chatgpt-enterprise/grassroots-champions-model.webp",
    "permanent": true
  },
  {
    "source": "/images/products/ai-career-operating-system/six-advisory-review-agents.png",
    "destination": "/images/products/ai-career-operating-system/six-advisory-review-agents.webp",
    "permanent": true
  },
  {
    "source": "/images/launchmuse-product-hero.png",
    "destination": "/images/launchmuse-product-hero.webp",
    "permanent": true
  },
  {
    "source": "/images/launchmuse-screenshot.png",
    "destination": "/images/launchmuse-screenshot.webp",
    "permanent": true
  },
  {
    "source": "/images/chatgpt-enterprise/frontline-ideation.png",
    "destination": "/images/chatgpt-enterprise/frontline-ideation.webp",
    "permanent": true
  },
  {
    "source": "/images/farraginous/program-credit-fixed.png",
    "destination": "/images/farraginous/program-credit-fixed.webp",
    "permanent": true
  }
],
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
        destination: "/work/chatgpt-enterprise",
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
