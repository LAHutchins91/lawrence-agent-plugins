import { type ProcEntry } from "../lib/procfile.js";
export type ProcfileParseInput = {
    text: string;
};
export type ProcfileParseOutput = {
    entries: ProcEntry[];
    count: number;
};
export declare function procfileParse(input: ProcfileParseInput): ProcfileParseOutput;
