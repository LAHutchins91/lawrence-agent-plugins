import { type FunctionInfo } from "../lib/sam_heuristics.js";
export type SamFunctionsListInput = {
    text: string;
};
export type SamFunctionsListOutput = {
    functions: FunctionInfo[];
    count: number;
};
export declare function samFunctionsList(input: SamFunctionsListInput): SamFunctionsListOutput;
