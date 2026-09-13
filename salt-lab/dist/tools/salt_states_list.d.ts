export type SaltStatesListInput = {
    text: string;
};
export type SaltStatesListOutput = {
    states: Array<{
        id?: string;
        module?: string;
        fun?: string;
    }>;
    count: number;
};
export declare function saltStatesList(input: SaltStatesListInput): SaltStatesListOutput;
