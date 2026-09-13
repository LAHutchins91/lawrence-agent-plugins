import { type Finding } from "../lib/railway_config.js";
export type RailwayLintLiteInput = {
    text: string;
};
export type RailwayLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function railwayLintLite(input: RailwayLintLiteInput): RailwayLintLiteOutput;
