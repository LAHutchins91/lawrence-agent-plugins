import { type RuleInfo } from "../lib/joi_schema.js";
export type JoiRulesHintInput = {
    text: string;
};
export type JoiRulesHintOutput = {
    rules: RuleInfo[];
    count: number;
};
export declare function joiRulesHint(input: JoiRulesHintInput): JoiRulesHintOutput;
