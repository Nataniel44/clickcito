const nextConfig = {
    reactStrictMode: false,
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    images: {
        unoptimized: true,
    },

};

export default nextConfig;

