import { type ResourceInfo } from "../lib/pulumi_heuristics.js";
export type PulumiResourcesHintInput = {
    text: string;
};
export type PulumiResourcesHintOutput = {
    resources: ResourceInfo[];
    count: number;
};
export declare function pulumiResourcesHint(input: PulumiResourcesHintInput): PulumiResourcesHintOutput;
