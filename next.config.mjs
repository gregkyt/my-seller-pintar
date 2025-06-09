/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3005",
        pathname: "/api/image", // or "/**" to allow all paths
      },
    ],
  },
};

export default nextConfig;
