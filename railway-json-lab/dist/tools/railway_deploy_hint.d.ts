import { type RailwayDeployHint } from "../lib/railway_config.js";
export type RailwayDeployHintInput = {
    text: string;
};
export type RailwayDeployHintOutput = RailwayDeployHint;
export declare function railwayDeployHint(input: RailwayDeployHintInput): RailwayDeployHintOutput;
