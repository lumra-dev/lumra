import en from "../messages/en.json";
import ja from "../messages/ja.json";
import zh from "../messages/zh.json";

export const locales = ["en", "zh", "ja"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
	en: "English",
	zh: "中文",
	ja: "日本語",
};

export function isValidLocale(value: string): value is Locale {
	return locales.includes(value as Locale);
}

type MessagesType = typeof en;

export type Messages = MessagesType;

export type MessageNamespace = keyof Messages;

export type MessageKey<N extends MessageNamespace> = keyof Messages[N] & string;

export type InterpolationValues = Record<string, boolean | number | string>;

const messages: Record<Locale, Messages> = { en, zh, ja };

export function getMessages(locale: Locale): Messages {
	return messages[locale];
}

export function interpolate(
	value: string,
	values: InterpolationValues = {}
): string {
	return value.replace(/\{(\w+)\}/g, (match, key: string) => {
		// Keep unresolved placeholders visible for missing interpolation values.
		return key in values ? String(values[key]) : match;
	});
}

export function createTranslator(messagesValue: Messages) {
	return (key: string, values?: InterpolationValues): string => {
		let value: unknown = messagesValue;
		for (const segment of key.split(".")) {
			if (!(value && typeof value === "object" && segment in value)) {
				return key;
			}
			value = (value as Record<string, unknown>)[segment];
		}

		if (typeof value !== "string") {
			return key;
		}

		return interpolate(value, values);
	};
}
