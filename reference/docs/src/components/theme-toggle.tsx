"use client";

import { Button } from "@lumra/webui/components/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const isDark = resolvedTheme === "dark";

	return (
		<Button
			aria-label="Toggle color theme"
			onClick={() => setTheme(isDark ? "light" : "dark")}
			size="icon"
			type="button"
			variant="outline"
		>
			<Sun className="dark:hidden" data-icon="inline-start" />
			<Moon className="hidden dark:block" data-icon="inline-start" />
		</Button>
	);
}
