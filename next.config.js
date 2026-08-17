/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["*.monkeycode-ai.online"],
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/works.html", destination: "/works", permanent: true },
      { source: "/creates.html", destination: "/creates", permanent: true },
      { source: "/about.html", destination: "/about", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/work-paopao.html", destination: "/work/paopao", permanent: true },
      { source: "/work-pillowmist.html", destination: "/work/pillowmist", permanent: true },
      { source: "/work-ideaboom.html", destination: "/work/ideaboom", permanent: true },
      { source: "/work-cosmicbug.html", destination: "/work/cosmicbug", permanent: true },
    ];
  },
};

module.exports = nextConfig;
