import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans, Noto_Serif } from "next/font/google";

import "../index.css";
import { TooltipProvider } from "@lumra/webui/components/tooltip";
import { cn } from "@lumra/webui/lib/utils";

const notoSerifHeading = Noto_Serif({
	subsets: ["latin"],
	variable: "--font-heading",
});

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "lumra",
	description: "lumra",
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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			className={cn("font-sans", notoSans.variable, notoSerifHeading.variable)}
			lang="en"
			suppressHydrationWarning
		>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<div className="grid h-svh grid-rows-[auto_1fr]">
					<TooltipProvider>{children}</TooltipProvider>
				</div>
			</body>
		</html>
	);
}
