import { getHub } from "@lumra/hub";
import { createUIMessageStreamResponse, type UIMessage } from "ai";

export async function POST(request: Request) {
	const { messages }: { messages: UIMessage[] } = await request.json();
	const hub = await getHub();
	const run = await hub.startChatWorkflow(messages);

	return createUIMessageStreamResponse({
		stream: run.readable,
		headers: {
			"x-workflow-run-id": run.runId,
		},
	});
}
