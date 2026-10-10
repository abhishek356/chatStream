import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
    // compression buffers proxied responses and defeats streaming
    compress: false,
    async rewrites() {
        return [
            {
                source: '/api/v1/:path*',
                destination: `${process.env.BACKEND_URL}/api/v1/:path*`
            }
        ]
    }
}
export default nextConfig;