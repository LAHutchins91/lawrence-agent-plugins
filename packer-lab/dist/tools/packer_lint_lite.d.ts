import { type Finding } from "../lib/packer_heuristics.js";
export type PackerLintLiteInput = {
    text: string;
};
export type PackerLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function packerLintLite(input: PackerLintLiteInput): PackerLintLiteOutput;
