import { readdir, readFile } from "node:fs/promises";
import { basename, join, relative, sep } from "node:path";
import matter from "gray-matter";

const contentRoot = join(process.cwd(), "src/content");
const assetsSegment = "assets";
const markdownExtension = ".md";
const markdownExtensionPattern = /\.md$/;
const defaultCategoryDescription =
	"Reference pages from the docs content directory.";

export interface DocCategory {
	description: string;
	id: string;
	title: string;
}

export interface DocMetadata {
	description?: string;
	order?: number;
	title?: string;
}

export interface DocPage {
	category: string;
	content: string;
	description: string;
	order: number;
	slug: string;
	title: string;
}

const titleFromSegment = (segment: string) =>
	segment
		.split("-")
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

const slugFromFile = (filePath: string) =>
	relative(contentRoot, filePath)
		.split(sep)
		.join("/")
		.replace(markdownExtensionPattern, "");

const getMarkdownFiles = async (directory: string): Promise<string[]> => {
	const entries = await readdir(directory, { withFileTypes: true });
	const files: string[] = [];

	for (const entry of entries) {
		const entryPath = join(directory, entry.name);

		if (entry.isDirectory()) {
			if (entry.name !== assetsSegment) {
				files.push(...(await getMarkdownFiles(entryPath)));
			}
			continue;
		}

		if (entry.isFile() && entry.name.endsWith(markdownExtension)) {
			files.push(entryPath);
		}
	}

	return files;
};

const filePathFromSlug = (slug: string) => join(contentRoot, `${slug}.md`);

const readDocFile = async (slug: string) => {
	const file = await readFile(filePathFromSlug(slug), "utf8");
	const parsed = matter(file);

	return {
		content: parsed.content,
		metadata: parsed.data as DocMetadata,
	};
};

export const getDocSlugs = async () => {
	const files = await getMarkdownFiles(contentRoot);

	return files.map(slugFromFile).toSorted();
};

export const getDocBySlug = async (slug: string): Promise<DocPage | null> => {
	const slugs = await getDocSlugs();

	if (!slugs.includes(slug)) {
		return null;
	}

	const { content, metadata } = await readDocFile(slug);
	const [category = "docs", pageSegment = basename(slug)] = slug.split("/");

	return {
		slug,
		category,
		content,
		title: metadata.title ?? titleFromSegment(pageSegment),
		description: metadata.description ?? "",
		order: metadata.order ?? 0,
	};
};

export const getDocPages = async () => {
	const slugs = await getDocSlugs();
	const pages = await Promise.all(slugs.map((slug) => getDocBySlug(slug)));

	return pages
		.filter((page): page is DocPage => Boolean(page))
		.toSorted((firstPage, secondPage) => {
			if (firstPage.category !== secondPage.category) {
				return firstPage.category.localeCompare(secondPage.category);
			}

			if (firstPage.order !== secondPage.order) {
				return firstPage.order - secondPage.order;
			}

			return firstPage.title.localeCompare(secondPage.title);
		});
};

export const getDocCategories = async (): Promise<DocCategory[]> => {
	const pages = await getDocPages();
	const categoryIds = new Set(pages.map((page) => page.category));

	return [...categoryIds].map((id) => ({
		id,
		title: titleFromSegment(id),
		description: defaultCategoryDescription,
	}));
};

export const getDocsByCategory = async (category: string) => {
	const pages = await getDocPages();

	return pages.filter((page) => page.category === category);
};
