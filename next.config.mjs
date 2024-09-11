/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
        {
            // Googleアバターなどのリモート画像を許可
            hostname: "lh3.googleusercontent.com",
            protocol: "https",
        },
        {
            // GitHubのアバターなどのリモート画像を許可
            hostname: "avatars.githubusercontent.com",
            protocol: "https",
        },
      ],
    },
  };

export default nextConfig;
