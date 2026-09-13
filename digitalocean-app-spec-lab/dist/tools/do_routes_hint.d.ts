import { extractRoutesHint } from "../lib/app_spec.js";
export type DoRoutesHintInput = {
    text: string;
};
export type DoRoutesHintOutput = ReturnType<typeof extractRoutesHint>;
export declare function doRoutesHint(input: DoRoutesHintInput): DoRoutesHintOutput;
