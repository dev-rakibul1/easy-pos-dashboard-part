/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '7000',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'placekitten.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
