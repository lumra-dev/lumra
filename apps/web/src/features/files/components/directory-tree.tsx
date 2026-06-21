"use client";

import {
	FileTreeFile,
	FileTreeFolder,
} from "@lumra/webui/components/ai-elements/file-tree";

import { MOCK_FILE_TREE } from "@/features/files/data/file-tree";
import type { MockFileNode } from "@/features/files/types/file-node";

export function DirectoryTree() {
	return <DirectoryNode node={MOCK_FILE_TREE} />;
}

function DirectoryNode({ node }: { node: MockFileNode }) {
	if (node.type === "file") {
		return <FileTreeFile name={node.name} path={node.path} />;
	}

	return (
		<FileTreeFolder name={node.name} path={node.path}>
			{node.children?.map((child) => (
				<DirectoryNode key={child.path} node={child} />
			))}
		</FileTreeFolder>
	);
}
