"use client";

import { Button } from "@lumra/webui/components/button";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@lumra/webui/components/hover-card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@lumra/webui/components/tooltip";
import { InfoIcon } from "lucide-react";

import { t } from "@/features/i18n/lib/i18n";
import type { Workspace } from "@/features/workspaces/types/workspace";

export function WorkspaceInfo({ workspace }: { workspace: Workspace }) {
	const title = t(workspace.titleKey);

	return (
		<HoverCard>
			<Tooltip>
				<HoverCardTrigger>
					<TooltipTrigger
						render={
							<Button
								aria-label={t("dashboard.workspace.infoAria", { title })}
								size="icon-sm"
								variant="ghost"
							/>
						}
					>
						<InfoIcon />
					</TooltipTrigger>
				</HoverCardTrigger>
				<TooltipContent>{t("dashboard.workspace.context")}</TooltipContent>
			</Tooltip>
			<HoverCardContent align="start">
				<div className="flex flex-col gap-3">
					<div>
						<p className="font-medium">{title}</p>
						<p className="text-muted-foreground text-sm">
							{t(workspace.descriptionKey)}
						</p>
					</div>
					<div className="rounded-lg bg-muted p-3 text-muted-foreground text-xs">
						{t("dashboard.workspace.contextManaged")}
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
