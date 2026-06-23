"use client";

import {
	Conversation,
	ConversationContent,
	ConversationEmptyState,
} from "@lumra/webui/components/ai-elements/conversation";
import {
	Message,
	MessageContent,
	MessageResponse,
} from "@lumra/webui/components/ai-elements/message";
import {
	Tool,
	ToolContent,
	ToolHeader,
	ToolInput,
	ToolOutput,
	type ToolPart,
} from "@lumra/webui/components/ai-elements/tool";
import type { UIMessage } from "ai";
import { MessageSquareIcon } from "lucide-react";

import { t } from "@/features/i18n";

export function ConversationBody({
	error,
	messages,
}: {
	error?: Error;
	messages: UIMessage[];
}) {
	if (messages.length === 0) {
		return (
			<Conversation className="min-h-0">
				<ConversationEmptyState
					description={error?.message}
					icon={<MessageSquareIcon />}
					title={t("dashboard.conversation.empty")}
				/>
			</Conversation>
		);
	}

	return (
		<Conversation className="min-h-0">
			<ConversationContent className="gap-6" scrollClassName="overflow-y-auto">
				{messages.map((message) => (
					<Message from={message.role} key={message.id}>
						<MessageContent>
							{message.parts.map((part, index) => {
								if (part.type === "text") {
									return (
										<MessageResponse key={`${message.id}-${index}`}>
											{part.text}
										</MessageResponse>
									);
								}

								if (isToolPart(part)) {
									return (
										<Tool key={part.toolCallId}>
											{part.type === "dynamic-tool" ? (
												<ToolHeader
													state={part.state}
													toolName={part.toolName}
													type={part.type}
												/>
											) : (
												<ToolHeader state={part.state} type={part.type} />
											)}
											<ToolContent>
												<ToolInput input={part.input} />
												<ToolOutput
													errorText={part.errorText}
													output={part.output}
												/>
											</ToolContent>
										</Tool>
									);
								}

								return null;
							})}
						</MessageContent>
					</Message>
				))}
				{error && <p className="text-destructive text-sm">{error.message}</p>}
			</ConversationContent>
		</Conversation>
	);
}

function isToolPart(part: UIMessage["parts"][number]): part is ToolPart {
	return part.type === "dynamic-tool" || part.type.startsWith("tool-");
}
