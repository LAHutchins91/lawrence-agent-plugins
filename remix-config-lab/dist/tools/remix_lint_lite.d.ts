import { type Finding } from "../lib/remix_config.js";
export type RemixLintLiteInput = {
    text: string;
};
export type RemixLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function remixLintLite(input: RemixLintLiteInput): RemixLintLiteOutput;
