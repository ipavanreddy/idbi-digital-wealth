/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export: every route is prerendered ("output: export"), so the app
  // deploys to any static host (Netlify) with zero server runtime or plugins.
  output: "export",
  // Emit routes as folders (alerts/index.html) so deep links work on any host
  // without redirect rules.
  trailingSlash: true,
};

export default nextConfig;
