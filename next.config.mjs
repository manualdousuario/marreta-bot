/** @type {import('next').NextConfig} */
const nextConfig = {
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
