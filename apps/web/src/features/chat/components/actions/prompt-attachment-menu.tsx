"use client";

import {
	PromptInputActionAddAttachments,
	PromptInputActionMenu,
	PromptInputActionMenuContent,
	PromptInputActionMenuItem,
	PromptInputActionMenuTrigger,
} from "@lumra/webui/components/ai-elements/prompt-input";
import {
	DropdownMenuGroup,
	DropdownMenuSeparator,
} from "@lumra/webui/components/dropdown-menu";
import {
	CodeIcon,
	FileIcon,
	ImageIcon,
	LinkIcon,
	PaperclipIcon,
} from "lucide-react";

import { t } from "@/features/i18n";

export function PromptAttachmentMenu() {
	return (
		<PromptInputActionMenu>
			<PromptInputActionMenuTrigger
				aria-label={t("dashboard.prompt.addContext")}
				tooltip={t("dashboard.prompt.addContext")}
			/>
			<PromptInputActionMenuContent align="start" className="w-56 rounded-xl">
				<DropdownMenuGroup>
					<PromptInputActionAddAttachments
						label={t("dashboard.prompt.imageOrFile")}
					/>
					<PromptInputActionMenuItem>
						<PaperclipIcon data-icon="inline-start" />
						{t("dashboard.prompt.attachment")}
					</PromptInputActionMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<PromptInputActionMenuItem>
						<ImageIcon data-icon="inline-start" />
						{t("dashboard.prompt.image")}
					</PromptInputActionMenuItem>
					<PromptInputActionMenuItem>
						<FileIcon data-icon="inline-start" />
						{t("dashboard.prompt.file")}
					</PromptInputActionMenuItem>
					<PromptInputActionMenuItem>
						<LinkIcon data-icon="inline-start" />
						{t("dashboard.prompt.sourceLink")}
					</PromptInputActionMenuItem>
					<PromptInputActionMenuItem>
						<CodeIcon data-icon="inline-start" />
						{t("dashboard.prompt.codeSnippet")}
					</PromptInputActionMenuItem>
				</DropdownMenuGroup>
			</PromptInputActionMenuContent>
		</PromptInputActionMenu>
	);
}
