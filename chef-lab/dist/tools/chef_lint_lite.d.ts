import { type Finding } from "../lib/chef_heuristics.js";
export type ChefLintLiteInput = {
    text: string;
};
export type ChefLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function chefLintLite(input: ChefLintLiteInput): ChefLintLiteOutput;
