import { type PipelineInfo } from "../lib/skaffold_heuristics.js";
export type SkPipelinesListInput = {
    text: string;
};
export type SkPipelinesListOutput = {
    pipelines: PipelineInfo[];
    profiles: string[];
    count: number;
};
export declare function skPipelinesList(input: SkPipelinesListInput): SkPipelinesListOutput;
