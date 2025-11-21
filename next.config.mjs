/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '**.googleusercontent.com',
                pathname: '/**', // Allow all paths
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'gabportfolio.onrender.com',
                pathname: '/**', // Allow all paths under this domain
            },
        ],
    },
};

export default nextConfig;
