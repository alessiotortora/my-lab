import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: "http://localhost:4000/api/:path*",
			},
			{
				source: "/rpc/:path*",
				destination: "http://localhost:4000/rpc/:path*",
			},
			{
				source: "/auth/:path*",
				destination: "http://localhost:4000/auth/:path*",
			},
		];
	},
};

export default nextConfig;
