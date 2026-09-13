import { type ResourceInfo } from "../lib/cdk8s_heuristics.js";
export type Cdk8sResourcesHintInput = {
    text: string;
};
export type Cdk8sResourcesHintOutput = {
    resources: ResourceInfo[];
    count: number;
};
export declare function cdk8sResourcesHint(input: Cdk8sResourcesHintInput): Cdk8sResourcesHintOutput;
