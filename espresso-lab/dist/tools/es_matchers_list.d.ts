export type EsMatchersListInput = {
    text: string;
};
export type EsMatchersListOutput = {
    matchers: {
        name: string;
    }[];
    count: number;
};
export declare function esMatchersList(input: EsMatchersListInput): EsMatchersListOutput;
