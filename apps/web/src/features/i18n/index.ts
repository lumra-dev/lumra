import {
	createTranslator,
	defaultLocale,
	getMessages,
	type InterpolationValues,
} from "@lumra/i18n";

export const dashboardMessages = getMessages(defaultLocale);
export const t = createTranslator(dashboardMessages);

export type DashboardTranslate = (
	key: string,
	values?: InterpolationValues
) => string;
