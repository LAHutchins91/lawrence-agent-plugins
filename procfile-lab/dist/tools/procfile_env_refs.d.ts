import { type EnvRef } from "../lib/procfile.js";
export type ProcfileEnvRefsInput = {
    text: string;
};
export type ProcfileEnvRefsOutput = {
    refs: EnvRef[];
    unique: string[];
    count: number;
};
export declare function procfileEnvRefs(input: ProcfileEnvRefsInput): ProcfileEnvRefsOutput;
