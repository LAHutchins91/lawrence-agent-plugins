import { type Finding } from "../lib/puppet_heuristics.js";
export type PuppetLintLiteInput = {
    text: string;
};
export type PuppetLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function puppetLintLite(input: PuppetLintLiteInput): PuppetLintLiteOutput;
