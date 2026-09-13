import { type FutureFlagsResult } from "../lib/remix_config.js";
export type RemixFutureFlagsInput = {
    text: string;
};
export type RemixFutureFlagsOutput = FutureFlagsResult;
export declare function remixFutureFlags(input: RemixFutureFlagsInput): RemixFutureFlagsOutput;
