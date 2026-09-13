export type SgUrlsListInput = {
    text: string;
};
export type SgUrlsListOutput = {
    urls: string[];
    count: number;
};
export declare function sgUrlsList(input: SgUrlsListInput): SgUrlsListOutput;
