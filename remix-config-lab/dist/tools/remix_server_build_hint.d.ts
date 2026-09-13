import { type ServerBuildHintResult } from "../lib/remix_config.js";
export type RemixServerBuildHintInput = {
    text: string;
};
export type RemixServerBuildHintOutput = ServerBuildHintResult;
export declare function remixServerBuildHint(input: RemixServerBuildHintInput): RemixServerBuildHintOutput;
