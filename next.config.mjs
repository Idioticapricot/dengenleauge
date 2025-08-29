/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['blob.v0.dev'],
    unoptimized: true,
  },
  webpack: (config) => {
    // Optimize bundle splitting
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        wallet: {
          test: /[\\/]node_modules[\\/](@txnlab|@perawallet|@blockshake)[\\/]/,
          name: 'wallet',
          chunks: 'all',
        },
      },
    }
    return config
  },
}

export default nextConfig
