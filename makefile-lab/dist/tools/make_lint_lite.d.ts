import { type Finding } from "../lib/makefile.js";
export type MakeLintLiteInput = {
    text: string;
};
export type MakeLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function makeLintLite(input: MakeLintLiteInput): MakeLintLiteOutput;
