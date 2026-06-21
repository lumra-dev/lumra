import { type ParseError, parse, printParseErrorCode } from "jsonc-parser";

export const JSONC = {
	parse: (source: string) => {
		const errors: ParseError[] = [];
		const value = parse(source, errors, { allowTrailingComma: true });

		if (errors.length > 0) {
			const [error] = errors;

			if (!error) {
				throw new Error("Invalid JSONC");
			}

			throw new Error(
				`Invalid JSONC at offset ${error.offset}: ${printParseErrorCode(error.error)}`
			);
		}

		return value;
	},
	stringify: JSON.stringify,
};
