import { type Finding } from "../lib/zod_schema.js";
export type ZodLintLiteInput = {
    text: string;
};
export type ZodLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function zodLintLite(input: ZodLintLiteInput): ZodLintLiteOutput;
