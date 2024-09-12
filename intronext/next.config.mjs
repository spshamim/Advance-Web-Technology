/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/about/user',
          permanent: true
        },
      ]
    },
  };
  
export default nextConfig;  