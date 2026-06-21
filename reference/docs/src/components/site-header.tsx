import { Button } from "@lumra/webui/components/button";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
	return (
		<header className="sticky top-0 z-10 border-b bg-background/85 backdrop-blur">
			<div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
				<Link className="flex items-center gap-2 font-medium text-sm" href="/">
					<Image
						alt="Lumra logo"
						className="size-6"
						height={24}
						src="/favicon/favicon.svg"
						width={24}
					/>
					<span>Lumra Reference</span>
				</Link>
				<nav className="flex items-center gap-2">
					<Button
						render={<Link href="/docs/getting-started/overview" />}
						variant="ghost"
					>
						Docs
					</Button>
					<ThemeToggle />
				</nav>
			</div>
		</header>
	);
}
