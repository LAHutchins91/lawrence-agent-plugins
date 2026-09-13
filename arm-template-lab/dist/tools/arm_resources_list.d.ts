import { type ResourceInfo } from "../lib/arm_heuristics.js";
export type ArmResourcesListInput = {
    text: string;
};
export type ArmResourcesListOutput = {
    resources: ResourceInfo[];
    count: number;
};
export declare function armResourcesList(input: ArmResourcesListInput): ArmResourcesListOutput;
