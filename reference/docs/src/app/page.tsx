import { Button } from "@lumra/webui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@lumra/webui/components/card";
import { ArrowRight, BookOpen, Boxes, Layers3 } from "lucide-react";
import Link from "next/link";
import { getDocCategories, getDocsByCategory } from "@/content/docs";

const highlights = [
	{
		title: "Monorepo native",
		description:
			"Reference pages live beside the workspace and use the same Bun and Turbo toolchain.",
		icon: Boxes,
	},
	{
		title: "Markdown first",
		description:
			"Write docs with Markdown and frontmatter while routes are discovered automatically.",
		icon: BookOpen,
	},
	{
		title: "Clean UI system",
		description:
			"Built with @lumra/webui so product pages and docs share the same visual language.",
		icon: Layers3,
	},
];

export default async function Home() {
	const categories = await getDocCategories();
	const categoryCards = await Promise.all(
		categories.map(async (category) => {
			const pages = await getDocsByCategory(category.id);

			return (
				<Card key={category.id}>
					<CardHeader>
						<CardTitle>{category.title}</CardTitle>
						<CardDescription>{category.description}</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-2">
							{pages.map((page) => (
								<Link
									className="text-sm underline-offset-4 hover:underline"
									href={`/docs/${page.slug}`}
									key={page.slug}
								>
									{page.title}
								</Link>
							))}
						</div>
					</CardContent>
				</Card>
			);
		})
	);

	return (
		<main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-16 md:py-24">
			<section className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
				<div className="flex flex-col gap-6">
					<div className="w-fit border bg-muted px-3 py-1 text-muted-foreground text-xs">
						Lumra Reference Docs
					</div>
					<div className="flex flex-col gap-4">
						<h1 className="max-w-3xl text-balance font-medium text-4xl tracking-tight md:text-6xl">
							A calm documentation home for Lumra.
						</h1>
						<p className="max-w-2xl text-muted-foreground text-sm leading-7 md:text-base">
							Explore package structure, runtime conventions, and implementation
							guides from a small Markdown documentation site built inside the
							Lumra monorepo.
						</p>
					</div>
					<div className="flex flex-wrap gap-3">
						<Button
							render={<Link href="/docs/getting-started/overview" />}
							size="lg"
						>
							Read the docs
							<ArrowRight data-icon="inline-end" />
						</Button>
						<Button
							render={<Link href="/docs/reference/content" />}
							size="lg"
							variant="outline"
						>
							Content model
						</Button>
					</div>
				</div>
				<Card className="bg-muted/30">
					<CardHeader>
						<CardTitle>Reference workspace</CardTitle>
						<CardDescription>
							Two packages, one documentation surface.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-3 text-sm">
							<div className="border bg-background p-3">
								<span className="font-mono text-muted-foreground text-xs">
									@lumra/reference-docs
								</span>
								<p className="mt-1">Next.js documentation app</p>
							</div>
							<div className="border bg-background p-3">
								<span className="font-mono text-muted-foreground text-xs">
									src/content
								</span>
								<p className="mt-1">Markdown pages and image assets</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</section>

			<section className="grid gap-4 md:grid-cols-3">
				{highlights.map((highlight) => (
					<Card key={highlight.title}>
						<CardHeader>
							<highlight.icon className="mb-2 text-muted-foreground" />
							<CardTitle>{highlight.title}</CardTitle>
							<CardDescription>{highlight.description}</CardDescription>
						</CardHeader>
					</Card>
				))}
			</section>

			<section className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<h2 className="font-medium text-2xl tracking-tight">Documentation</h2>
					<p className="text-muted-foreground text-sm">
						Start with the overview, then move into guides and reference pages.
					</p>
				</div>
				<div className="grid gap-4 md:grid-cols-3">{categoryCards}</div>
			</section>
		</main>
	);
}
