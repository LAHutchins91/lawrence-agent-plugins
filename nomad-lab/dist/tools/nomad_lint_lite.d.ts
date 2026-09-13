import { type Finding } from "../lib/nomad_heuristics.js";
export type NomadLintLiteInput = {
    text: string;
};
export type NomadLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function nomadLintLite(input: NomadLintLiteInput): NomadLintLiteOutput;
