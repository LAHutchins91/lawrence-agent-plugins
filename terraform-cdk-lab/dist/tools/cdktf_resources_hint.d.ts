import { type ResourceInfo } from "../lib/cdktf_heuristics.js";
export type CdktfResourcesHintInput = {
    text: string;
};
export type CdktfResourcesHintOutput = {
    resources: ResourceInfo[];
    count: number;
};
export declare function cdktfResourcesHint(input: CdktfResourcesHintInput): CdktfResourcesHintOutput;
