import { type RoutesHintResult } from "../lib/remix_config.js";
export type RemixRoutesHintInput = {
    text: string;
};
export type RemixRoutesHintOutput = RoutesHintResult;
export declare function remixRoutesHint(input: RemixRoutesHintInput): RemixRoutesHintOutput;
