import { type Finding } from "../lib/vitest_mocks.js";
export type VmLintLiteInput = {
    text: string;
};
export type VmLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function vmLintLite(input: VmLintLiteInput): VmLintLiteOutput;
