import { type PathInfo } from "../lib/openapi_zod.js";
export type OzPathsListInput = {
    text: string;
};
export type OzPathsListOutput = {
    paths: PathInfo[];
    count: number;
};
export declare function ozPathsList(input: OzPathsListInput): OzPathsListOutput;
