import { type MakeVar } from "../lib/makefile.js";
export type MakeVarLookupInput = {
    text: string;
    name?: string;
};
export type MakeVarLookupOutput = {
    vars: MakeVar[];
    count: number;
};
export declare function makeVarLookup(input: MakeVarLookupInput): MakeVarLookupOutput;
