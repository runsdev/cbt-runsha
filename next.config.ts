/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
}

// Merge MDX config with Next.js config
export default nextConfig;