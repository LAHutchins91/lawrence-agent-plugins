export type EslintExtendsListInput = {
    text: string;
};
export type EslintExtendsListOutput = {
    extends: string[];
    count: number;
};
export declare function eslintExtendsList(input: EslintExtendsListInput): EslintExtendsListOutput;
