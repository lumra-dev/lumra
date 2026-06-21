import z from "zod";

const ENV_TEMPLATE_PATTERN = /\$\{([A-Z_][A-Z0-9_]*)\}/g;

export const env = () =>
	z
		.string()
		.transform((value) =>
			value.replace(ENV_TEMPLATE_PATTERN, (token, envName: string) => {
				const envValue = process.env[envName];

				// Keep unresolved tokens visible instead of silently dropping secrets.
				return envValue ?? token;
			})
		)
		.describe(
			// biome-ignore lint/suspicious/noTemplateCurlyInString: desctiption
			"A string that can include environment variable like ${VARIABLE_NAME}"
		);
