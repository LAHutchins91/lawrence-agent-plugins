import { type Finding } from "../lib/sinon_stubs.js";
export type SinonLintLiteInput = {
    text: string;
};
export type SinonLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function sinonLintLite(input: SinonLintLiteInput): SinonLintLiteOutput;
