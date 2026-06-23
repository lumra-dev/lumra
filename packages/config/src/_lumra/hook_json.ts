import z from "zod";

export const settingSchema = z.object({});
export default settingSchema;
export type SettingSchema = z.infer<typeof settingSchema>;
