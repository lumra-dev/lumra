import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactCompiler: true,
	typedRoutes: true,
	transpilePackages: ["@lumra/webui"],
	async rewrites() {
		return [
			{
				source: "/content-assets/:path*",
				destination: "/api/content-assets/:path*",
			},
		];
	},
};

export default nextConfig;
