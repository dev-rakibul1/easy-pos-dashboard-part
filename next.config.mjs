
/** @type {import('next').NextConfig} */
const nextConfig = {

    images: {


        domains: ["picsum.photos", "placehold.co", 'as1.ftcdn.net', "res.cloudinary.com", "via.placeholder.com", "fastly.picsum.photos"],

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
