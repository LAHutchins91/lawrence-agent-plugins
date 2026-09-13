import { type PageActionInfo } from "../lib/puppeteer_heuristics.js";
export type PptrPagesListInput = {
    text: string;
};
export type PptrPagesListOutput = {
    pages: PageActionInfo[];
    count: number;
};
export declare function pptrPagesList(input: PptrPagesListInput): PptrPagesListOutput;
