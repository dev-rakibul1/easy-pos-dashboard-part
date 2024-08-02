/** @type {import('next').NextConfig} */
const nextConfig = {

    images: {


        domains: ['as1.ftcdn.net', "res.cloudinary.com", "via.placeholder.com"],

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
