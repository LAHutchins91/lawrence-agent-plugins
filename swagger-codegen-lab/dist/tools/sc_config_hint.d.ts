import { type ConfigInfo } from "../lib/sc_heuristics.js";
export type ScConfigHintInput = {
    text: string;
};
export type ScConfigHintOutput = {
    configs: ConfigInfo[];
    additionalProperties?: Record<string, string>;
    count: number;
};
export declare function scConfigHint(input: ScConfigHintInput): ScConfigHintOutput;
