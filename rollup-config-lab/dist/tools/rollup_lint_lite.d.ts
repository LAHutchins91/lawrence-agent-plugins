import { type Finding } from "../lib/rollup_config.js";
export type RollupLintLiteInput = {
    text: string;
};
export type RollupLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function rollupLintLite(input: RollupLintLiteInput): RollupLintLiteOutput;
