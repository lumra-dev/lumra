import { Button } from "@lumra/webui/components/button";
import Link from "next/link";
import { getDocCategories, getDocsByCategory } from "@/content/docs";

interface DocsSidebarProps {
	activeSlug?: string;
}

export async function DocsSidebar({ activeSlug }: DocsSidebarProps) {
	const categories = await getDocCategories();
	const categorySections = await Promise.all(
		categories.map(async (category) => {
			const pages = await getDocsByCategory(category.id);

			return (
				<section className="flex flex-col gap-2" key={category.id}>
					<h2 className="font-medium text-foreground text-sm">
						{category.title}
					</h2>
					<div className="flex flex-col gap-1">
						{pages.map((page) => (
							<Button
								key={page.slug}
								render={<Link href={`/docs/${page.slug}`} />}
								size="sm"
								variant={activeSlug === page.slug ? "secondary" : "ghost"}
							>
								{page.title}
							</Button>
						))}
					</div>
				</section>
			);
		})
	);

	return (
		<aside className="flex flex-col gap-6 border-border border-r pr-6">
			{categorySections}
		</aside>
	);
}
