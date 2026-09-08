import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const isMobile = process.env.MOBILE_APP === "true";
const githubPagesBasePath = "/eskisehir-turizm-altyapi";

const nextConfig: NextConfig = {
  ...(isGitHubPages || isMobile
    ? {
        output: "export" as const,
        basePath: isMobile ? "" : githubPagesBasePath,
        trailingSlash: true,
        images: { unoptimized: true },
        typescript: { ignoreBuildErrors: true },
      }
    : {}),
};

export default nextConfig;
