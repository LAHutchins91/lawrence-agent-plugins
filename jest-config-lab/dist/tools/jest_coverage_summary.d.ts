import { type CoverageSummary } from "../lib/jest_config.js";
export type JestCoverageSummaryInput = {
    text: string;
};
export type JestCoverageSummaryOutput = CoverageSummary;
export declare function jestCoverageSummary(input: JestCoverageSummaryInput): JestCoverageSummaryOutput;
