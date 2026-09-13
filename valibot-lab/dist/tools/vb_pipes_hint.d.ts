import { type PipeInfo } from "../lib/valibot_schema.js";
export type VbPipesHintInput = {
    text: string;
};
export type VbPipesHintOutput = {
    pipes: PipeInfo[];
    count: number;
};
export declare function vbPipesHint(input: VbPipesHintInput): VbPipesHintOutput;
