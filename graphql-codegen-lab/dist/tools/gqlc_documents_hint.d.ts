export type GqlcDocumentsHintInput = {
    text: string;
};
export type GqlcDocumentsHintOutput = {
    schema?: string | string[];
    documents?: string | string[];
    count: number;
};
export declare function gqlcDocumentsHint(input: GqlcDocumentsHintInput): GqlcDocumentsHintOutput;
