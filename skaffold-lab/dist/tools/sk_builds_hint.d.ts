import { type BuildInfo } from "../lib/skaffold_heuristics.js";
export type SkBuildsHintInput = {
    text: string;
};
export type SkBuildsHintOutput = {
    builds: BuildInfo[];
    count: number;
};
export declare function skBuildsHint(input: SkBuildsHintInput): SkBuildsHintOutput;
