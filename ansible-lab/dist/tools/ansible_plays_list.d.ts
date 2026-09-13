export type AnsiblePlaysListInput = {
    text: string;
};
export type AnsiblePlaysListOutput = {
    plays: Array<{
        name?: string;
        hosts?: string;
        become?: boolean | string;
        gatherFacts?: boolean | string;
        strategy?: string;
    }>;
    count: number;
};
export declare function ansiblePlaysList(input: AnsiblePlaysListInput): AnsiblePlaysListOutput;
