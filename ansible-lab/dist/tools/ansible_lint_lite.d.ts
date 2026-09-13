import { type Finding } from "../lib/ansible_heuristics.js";
export type AnsibleLintLiteInput = {
    text: string;
};
export type AnsibleLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function ansibleLintLite(input: AnsibleLintLiteInput): AnsibleLintLiteOutput;
