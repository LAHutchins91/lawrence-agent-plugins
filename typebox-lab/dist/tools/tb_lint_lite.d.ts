import { type Finding } from "../lib/typebox_schema.js";
export type TbLintLiteInput = {
    text: string;
};
export type TbLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function tbLintLite(input: TbLintLiteInput): TbLintLiteOutput;
