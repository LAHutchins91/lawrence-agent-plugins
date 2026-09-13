import { type ValueHint } from "../lib/helm_heuristics.js";
export type HelmValuesHintInput = {
    text: string;
};
export type HelmValuesHintOutput = {
    keys: string[];
    hints: ValueHint[];
    secretKeyNames?: string[];
    count: number;
};
export declare function helmValuesHint(input: HelmValuesHintInput): HelmValuesHintOutput;
