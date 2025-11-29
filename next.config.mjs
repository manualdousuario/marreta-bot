/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "https://marreta.link/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
