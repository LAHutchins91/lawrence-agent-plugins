import { type RuleEntry } from "../lib/eslint_config.js";
export type EslintRulesSummaryInput = {
    text: string;
};
export type EslintRulesSummaryOutput = {
    rules: RuleEntry[];
    counts: {
        error: number;
        warn: number;
        off: number;
        other: number;
    };
    total: number;
};
export declare function eslintRulesSummary(input: EslintRulesSummaryInput): EslintRulesSummaryOutput;
