const nextConfig = {
    // output: 'export', // Quitamos esto para que Vercel use Server Actions (Node.js)
    reactStrictMode: false,
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    images: {
        unoptimized: true,
    },
    trailingSlash: false,
};

export default nextConfig;

