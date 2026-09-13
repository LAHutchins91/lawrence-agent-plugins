import { type Finding } from "../lib/openapi_zod.js";
export type OzLintLiteInput = {
    text: string;
};
export type OzLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function ozLintLite(input: OzLintLiteInput): OzLintLiteOutput;
