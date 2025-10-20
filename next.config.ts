import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import bundleAnalyzer from "@next/bundle-analyzer";

// Bundle analyzer (enabled with ANALYZE=true)
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-avatar",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-tabs",
      "date-fns",
      "react-hook-form",
    ],
    // Enable WebAssembly support for better performance
    webVitalsAttribution: ["CLS", "LCP", "FCP", "FID", "TTFB", "INP"],
  },

  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // Compression
  compress: true,

  // Production optimizations
  productionBrowserSourceMaps: false, // Disable source maps in production for smaller builds

  // PoweredByHeader
  poweredByHeader: false,

  // Bundle analyzer and webpack optimizations
  webpack: (config, { isServer }) => {
    // Optimize client-side bundles
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };

      // Split vendor chunks for better caching
      if (config.optimization?.splitChunks) {
        config.optimization.splitChunks.cacheGroups = {
          ...config.optimization.splitChunks.cacheGroups,
          codemirror: {
            test: /[\\/]node_modules[\\/]@codemirror[\\/]/,
            name: "codemirror-vendor",
            priority: 30,
            reuseExistingChunk: true,
          },
          radixui: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: "radix-vendor",
            priority: 25,
            reuseExistingChunk: true,
          },
          reactSyntaxHighlighter: {
            test: /[\\/]node_modules[\\/]react-syntax-highlighter[\\/]/,
            name: "syntax-highlighter",
            priority: 20,
            reuseExistingChunk: true,
          },
        };
      }
    }

    return config;
  },

  // Headers for caching
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=60, s-maxage=60",
          },
        ],
      },
    ];
  },
};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(withBundleAnalyzer(nextConfig));
