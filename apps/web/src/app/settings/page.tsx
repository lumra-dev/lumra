import Link from "next/link";
import { RuntimeConfigEditor } from "@/features/settings/components/runtime-config-editor";
import { getRuntimeConfigEditorFiles } from "@/features/settings/lib/runtime-config";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
	const files = await getRuntimeConfigEditorFiles();

	return (
		<main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6">
			<header className="flex flex-wrap items-center justify-between gap-3">
				<div className="grid gap-1">
					<h1 className="font-heading font-medium text-2xl">Settings</h1>
					<p className="text-muted-foreground text-sm">
						Edit runtime JSONC configuration files stored by the active adapter.
					</p>
				</div>
				<Link
					className="text-muted-foreground text-sm underline-offset-4 hover:text-foreground hover:underline"
					href="/"
				>
					Home
				</Link>
			</header>
			<RuntimeConfigEditor files={files} />
		</main>
	);
}
