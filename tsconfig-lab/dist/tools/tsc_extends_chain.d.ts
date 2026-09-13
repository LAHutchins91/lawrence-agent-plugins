export type TscExtendsChainInput = {
    text: string;
};
export type TscExtendsChainOutput = {
    extends: string | string[] | null;
    chain: string[];
};
/**
 * Report extends as declared strings only — do not fetch/read files.
 */
export declare function tscExtendsChain(input: TscExtendsChainInput): TscExtendsChainOutput;
