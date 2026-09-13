import { type MakeTarget } from "../lib/makefile.js";
export type MakeTargetsListInput = {
    text: string;
};
export type MakeTargetsListOutput = {
    targets: MakeTarget[];
    count: number;
};
export declare function makeTargetsList(input: MakeTargetsListInput): MakeTargetsListOutput;
