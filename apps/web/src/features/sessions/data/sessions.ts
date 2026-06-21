import {
	BotIcon,
	CircleGaugeIcon,
	CloudIcon,
	LibraryIcon,
	UsersIcon,
	WrenchIcon,
} from "lucide-react";

import type { NavItem, Session } from "../types/session";

export const NAV_ITEMS: NavItem[] = [
	{ labelKey: "dashboard.nav.overview", icon: CircleGaugeIcon },
	{ labelKey: "dashboard.nav.memory", icon: BotIcon },
	{ labelKey: "dashboard.nav.skills", icon: WrenchIcon },
	{ labelKey: "dashboard.nav.agents", icon: UsersIcon },
	{ labelKey: "dashboard.nav.collections", icon: LibraryIcon },
	{ labelKey: "dashboard.nav.hub", icon: CloudIcon },
];

export const SESSIONS: Session[] = [
	{
		id: "default",
		titleKey: "dashboard.sessions.default.title",
		descriptionKey: "dashboard.sessions.default.description",
		timestamp: "06/08 22:59",
		sourceKey: "dashboard.sessionSources.web",
		statusKey: "dashboard.sessionStatuses.active",
	},
	{
		id: "memory-sync",
		titleKey: "dashboard.sessions.memorySync.title",
		descriptionKey: "dashboard.sessions.memorySync.description",
		timestamp: "06/08 23:00",
		sourceKey: "dashboard.sessionSources.web",
		statusKey: "dashboard.sessionStatuses.idle",
	},
	{
		id: "browser-agent",
		titleKey: "dashboard.sessions.browserAgent.title",
		descriptionKey: "dashboard.sessions.browserAgent.description",
		timestamp: "06/09 09:12",
		sourceKey: "dashboard.sessionSources.local",
		statusKey: "dashboard.sessionStatuses.idle",
	},
	{
		id: "runtime-check",
		titleKey: "dashboard.sessions.runtimeCheck.title",
		descriptionKey: "dashboard.sessions.runtimeCheck.description",
		timestamp: "06/09 09:40",
		sourceKey: "dashboard.sessionSources.cli",
		statusKey: "dashboard.sessionStatuses.queued",
	},
];
