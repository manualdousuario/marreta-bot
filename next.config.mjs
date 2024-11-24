/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "https://marreta.pcdomanual.com/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
