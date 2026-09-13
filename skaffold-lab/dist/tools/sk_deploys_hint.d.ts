import { type DeployInfo } from "../lib/skaffold_heuristics.js";
export type SkDeploysHintInput = {
    text: string;
};
export type SkDeploysHintOutput = {
    deploys: DeployInfo[];
    count: number;
};
export declare function skDeploysHint(input: SkDeploysHintInput): SkDeploysHintOutput;
