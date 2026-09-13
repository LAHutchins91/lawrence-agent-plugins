import { type E2eSummary } from "../lib/cypress_config.js";
export type CyE2eSummaryInput = {
    text: string;
};
export type CyE2eSummaryOutput = E2eSummary;
export declare function cyE2eSummary(input: CyE2eSummaryInput): CyE2eSummaryOutput;
