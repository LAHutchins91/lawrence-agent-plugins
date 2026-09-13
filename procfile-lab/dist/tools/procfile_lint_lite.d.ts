import { type Finding } from "../lib/procfile.js";
export type ProcfileLintLiteInput = {
    text: string;
};
export type ProcfileLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function procfileLintLite(input: ProcfileLintLiteInput): ProcfileLintLiteOutput;
