export type MakePhonyListInput = {
    text: string;
};
export type MakePhonyListOutput = {
    phony: string[];
    count: number;
};
export declare function makePhonyList(input: MakePhonyListInput): MakePhonyListOutput;
