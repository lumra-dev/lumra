import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import "../index.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	metadataBase: new URL("https://lumra.dev"),
	title: {
		default: "Lumra Reference",
		template: "%s · Lumra Reference",
	},
	description:
		"Clean reference documentation for Lumra packages, runtimes, and integration workflows.",
	applicationName: "Lumra Reference Docs",
	authors: [{ name: "Lumra" }],
	creator: "Lumra",
	publisher: "Lumra",
	alternates: {
		canonical: "/",
	},
	keywords: [
		"Lumra",
		"reference documentation",
		"runtime",
		"tools",
		"monorepo",
	],
	openGraph: {
		title: "Lumra Reference",
		description:
			"Clean reference documentation for Lumra packages, runtimes, and integration workflows.",
		url: "/",
		siteName: "Lumra Reference Docs",
		type: "website",
		locale: "en_US",
		images: [
			{
				url: "/favicon/web-app-manifest-512x512.png",
				width: 512,
				height: 512,
				alt: "Lumra logo",
			},
		],
	},
	twitter: {
		card: "summary",
		title: "Lumra Reference",
		description:
			"Clean reference documentation for Lumra packages, runtimes, and integration workflows.",
		images: ["/favicon/web-app-manifest-512x512.png"],
	},
	icons: {
		icon: [
			{ url: "/favicon/favicon.svg", type: "image/svg+xml" },
			{ url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
			{ url: "/favicon/favicon.ico", sizes: "32x32", type: "image/x-icon" },
		],
		apple: [
			{
				url: "/favicon/apple-touch-icon.png",
				sizes: "180x180",
				type: "image/png",
			},
		],
	},
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} min-h-svh bg-background text-foreground antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					disableTransitionOnChange
					enableSystem
				>
					<SiteHeader />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
