export type ProcfileProcessListInput = {
    text: string;
};
export type ProcfileProcessListOutput = {
    processes: string[];
    count: number;
};
export declare function procfileProcessList(input: ProcfileProcessListInput): ProcfileProcessListOutput;
