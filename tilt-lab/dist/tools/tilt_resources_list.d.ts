import { type ResourceInfo } from "../lib/tilt_heuristics.js";
export type TiltResourcesListInput = {
    text: string;
};
export type TiltResourcesListOutput = {
    resources: ResourceInfo[];
    count: number;
};
export declare function tiltResourcesList(input: TiltResourcesListInput): TiltResourcesListOutput;
