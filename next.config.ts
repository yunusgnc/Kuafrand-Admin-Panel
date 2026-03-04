import type { NextConfig } from 'next'

const basePath = process.env.BASEPATH?.startsWith('/') ? process.env.BASEPATH : undefined

const nextConfig: NextConfig = {
  basePath,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
        locale: false
      }
    ]
  }
}

export default nextConfig
