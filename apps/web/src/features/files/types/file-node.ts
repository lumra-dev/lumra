export interface MockFileNode {
	children?: MockFileNode[];
	name: string;
	path: string;
	type: "file" | "folder";
}
