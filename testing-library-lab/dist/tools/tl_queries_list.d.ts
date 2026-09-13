import { type QueryInfo } from "../lib/testing_library_heuristics.js";
export type TlQueriesListInput = {
    text: string;
};
export type TlQueriesListOutput = {
    queries: QueryInfo[];
    count: number;
};
export declare function tlQueriesList(input: TlQueriesListInput): TlQueriesListOutput;
