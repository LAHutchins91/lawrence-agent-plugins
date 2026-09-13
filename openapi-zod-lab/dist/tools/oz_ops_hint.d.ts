import { type OpHint } from "../lib/openapi_zod.js";
export type OzOpsHintInput = {
    text: string;
};
export type OzOpsHintOutput = {
    operations: OpHint[];
    count: number;
};
export declare function ozOpsHint(input: OzOpsHintInput): OzOpsHintOutput;
