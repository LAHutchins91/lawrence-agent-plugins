import { type Finding } from "../lib/vagrant_heuristics.js";
export type VagrantLintLiteInput = {
    text: string;
};
export type VagrantLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function vagrantLintLite(input: VagrantLintLiteInput): VagrantLintLiteOutput;
