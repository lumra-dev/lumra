"use client";

import type { Route } from "next";
import Link from "next/link";

export default function Home() {
	return (
		<div className="container mx-auto max-w-3xl px-4 py-2">
			<div className="grid gap-6">
				<section className="grid gap-3 rounded-lg border p-4">
					<Link
						className="text-muted-foreground text-sm underline-offset-4 hover:text-foreground hover:underline"
						href="/dashboard"
					>
						Dashboard
					</Link>
					<Link
						className="text-muted-foreground text-sm underline-offset-4 hover:text-foreground hover:underline"
						href={"/settings" as Route}
					>
						Settings
					</Link>
				</section>
			</div>
		</div>
	);
}
