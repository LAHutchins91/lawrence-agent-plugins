import { type ParameterInfo } from "../lib/arm_heuristics.js";
export type ArmParametersHintInput = {
    text: string;
};
export type ArmParametersHintOutput = {
    parameters: ParameterInfo[];
    count: number;
};
export declare function armParametersHint(input: ArmParametersHintInput): ArmParametersHintOutput;
