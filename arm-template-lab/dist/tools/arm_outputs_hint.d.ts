import { type OutputInfo } from "../lib/arm_heuristics.js";
export type ArmOutputsHintInput = {
    text: string;
};
export type ArmOutputsHintOutput = {
    outputs: OutputInfo[];
    count: number;
};
export declare function armOutputsHint(input: ArmOutputsHintInput): ArmOutputsHintOutput;
