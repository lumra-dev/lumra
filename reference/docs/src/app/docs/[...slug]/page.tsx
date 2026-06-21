import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsSidebar } from "@/components/docs-sidebar";
import { MarkdownContent } from "@/components/markdown-content";
import { getDocBySlug, getDocPages } from "@/content/docs";

interface DocPageProps {
	params: Promise<{
		slug: string[];
	}>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
	const pages = await getDocPages();

	return pages.map((page) => ({
		slug: page.slug.split("/"),
	}));
}

export async function generateMetadata({
	params,
}: DocPageProps): Promise<Metadata> {
	const { slug } = await params;
	const page = await getDocBySlug(slug.join("/"));

	if (!page) {
		return {};
	}

	return {
		title: page.title,
		description: page.description,
	};
}

export default async function DocPage({ params }: DocPageProps) {
	const { slug } = await params;
	const slugPath = slug.join("/");
	const page = await getDocBySlug(slugPath);

	if (!page) {
		notFound();
	}

	return (
		<main className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 md:grid-cols-[240px_1fr]">
			<DocsSidebar activeSlug={slugPath} />
			<article className="max-w-3xl text-sm leading-7 [&_a]:underline [&_code]:border [&_code]:bg-muted [&_code]:px-1 [&_h1]:mb-4 [&_h1]:font-medium [&_h1]:text-4xl [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-medium [&_h2]:text-2xl [&_img]:my-6 [&_li]:my-1 [&_p]:my-4 [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:bg-muted [&_pre]:p-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5">
				<MarkdownContent content={page.content} />
			</article>
		</main>
	);
}
