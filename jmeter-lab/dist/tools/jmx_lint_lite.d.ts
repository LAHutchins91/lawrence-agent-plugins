import { type Finding } from "../lib/jmeter_heuristics.js";
export type JmxLintLiteInput = {
    text: string;
};
export type JmxLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function jmxLintLite(input: JmxLintLiteInput): JmxLintLiteOutput;
