import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const DEFAULT_MARKDOWN_IMAGE_WIDTH = 1200;
const DEFAULT_MARKDOWN_IMAGE_HEIGHT = 640;

interface MarkdownContentProps {
	content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
	return (
		<ReactMarkdown
			components={{
				img: ({ alt = "", src }) => {
					if (typeof src !== "string") {
						return null;
					}

					return (
						<Image
							alt={alt}
							className="border"
							height={DEFAULT_MARKDOWN_IMAGE_HEIGHT}
							src={src}
							width={DEFAULT_MARKDOWN_IMAGE_WIDTH}
						/>
					);
				},
			}}
			remarkPlugins={[remarkGfm]}
		>
			{content}
		</ReactMarkdown>
	);
}
