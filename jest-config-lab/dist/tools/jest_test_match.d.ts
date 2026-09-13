import { type TestMatchSummary } from "../lib/jest_config.js";
export type JestTestMatchInput = {
    text: string;
};
export type JestTestMatchOutput = TestMatchSummary;
export declare function jestTestMatch(input: JestTestMatchInput): JestTestMatchOutput;
