import { type InputListResult } from "../lib/rollup_config.js";
export type RollupInputListInput = {
    text: string;
};
export type RollupInputListOutput = InputListResult;
export declare function rollupInputList(input: RollupInputListInput): RollupInputListOutput;
