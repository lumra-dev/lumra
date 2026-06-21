import { type ILogObj, Logger } from "tslog";

export const log: Logger<ILogObj> = new Logger({
	type: "pretty",
	prettyLogTemplate:
		"{{hh}}:{{MM}}:{{ss}} {{logLevelName}} {{filePathWithLine}} ",
});
