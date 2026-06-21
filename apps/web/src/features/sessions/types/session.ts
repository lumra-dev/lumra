import type { LucideIcon } from "lucide-react";

export interface Session {
	descriptionKey: string;
	id: string;
	sourceKey: string;
	statusKey: string;
	timestamp: string;
	titleKey: string;
}

export interface NavItem {
	icon: LucideIcon;
	labelKey: string;
}
