export type VagrantBoxesListInput = {
    text: string;
};
export type VagrantBoxesListOutput = {
    boxes: Array<{
        name?: string;
        box?: string;
        version?: string;
    }>;
    count: number;
};
export declare function vagrantBoxesList(input: VagrantBoxesListInput): VagrantBoxesListOutput;
