import type { AnthropicProvider } from "@ai-sdk/anthropic";
import type { GoogleGenerativeAIProvider } from "@ai-sdk/google";
import type { OpenAIProvider } from "@ai-sdk/openai";
import type { OpenAICompatibleProvider } from "@ai-sdk/openai-compatible";
import { log } from "@lumra/log";

export type ProviderType =
	| "anthropic"
	| "claude"
	| "gemini"
	| "openai"
	| "openai-compatible";

export interface CreateProviderOptions {
	apiKey: string;
	baseURL: string;
	headers: Record<string, string>;
	name: string;
	type: ProviderType;
}

export interface CreateModelOptions extends CreateProviderOptions {
	model: string;
}

export type CreatedProvider =
	| AnthropicProvider
	| GoogleGenerativeAIProvider
	| OpenAIProvider
	| OpenAICompatibleProvider;

export type CreatedLanguageModel = ReturnType<CreatedProvider["languageModel"]>;
export type CreatedEmbeddingModel = ReturnType<
	Extract<CreatedProvider, { embeddingModel: unknown }>["embeddingModel"]
>;

export async function createProvider(
	options: CreateProviderOptions
): Promise<CreatedProvider> {
	const { type, ...settings } = options;

	switch (type) {
		case "claude":
		case "anthropic": {
			const { createAnthropic } = await import("@ai-sdk/anthropic");
			log.debug("Creating provider", { name: options.name, type });
			return createAnthropic(settings);
		}
		case "gemini": {
			const { createGoogleGenerativeAI } = await import("@ai-sdk/google");
			log.debug("Creating provider", { name: options.name, type });
			return createGoogleGenerativeAI(settings);
		}
		case "openai": {
			const { createOpenAI } = await import("@ai-sdk/openai");
			log.debug("Creating provider", { name: options.name, type });
			return createOpenAI(settings);
		}
		case "openai-compatible": {
			const { createOpenAICompatible } = await import(
				"@ai-sdk/openai-compatible"
			);
			log.debug("Creating provider", { name: options.name, type });
			return createOpenAICompatible(settings);
		}
		default: {
			throw new Error(`Unsupported provider type: ${type satisfies never}`);
		}
	}
}

export async function createLanguageModel(
	options: CreateModelOptions
): Promise<CreatedLanguageModel> {
	const { model, ...providerOptions } = options;
	log.debug("Creating language model", { model, type: providerOptions.type });
	const provider = await createProvider(providerOptions);

	return provider.languageModel(model);
}

export async function createEmbeddingModel(
	options: CreateModelOptions
): Promise<CreatedEmbeddingModel> {
	const { model, ...providerOptions } = options;
	log.debug("Creating embedding model", { model, type: providerOptions.type });
	const provider = await createProvider(providerOptions);

	if (!("embeddingModel" in provider)) {
		throw new Error(
			`Provider "${providerOptions.type}" does not support embeddings`
		);
	}

	return provider.embeddingModel(model);
}
