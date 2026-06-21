import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Lumra Reference Docs",
		short_name: "Lumra Docs",
		description:
			"Clean reference documentation for Lumra packages, runtimes, and integration workflows.",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#18181b",
		icons: [
			{
				src: "/favicon/web-app-manifest-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/favicon/web-app-manifest-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
