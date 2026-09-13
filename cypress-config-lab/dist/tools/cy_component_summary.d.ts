import { type ComponentSummary } from "../lib/cypress_config.js";
export type CyComponentSummaryInput = {
    text: string;
};
export type CyComponentSummaryOutput = ComponentSummary;
export declare function cyComponentSummary(input: CyComponentSummaryInput): CyComponentSummaryOutput;
