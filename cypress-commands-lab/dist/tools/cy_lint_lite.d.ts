import { type Finding } from "../lib/cypress_commands.js";
export type CyLintLiteInput = {
    text: string;
};
export type CyLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function cyLintLite(input: CyLintLiteInput): CyLintLiteOutput;
