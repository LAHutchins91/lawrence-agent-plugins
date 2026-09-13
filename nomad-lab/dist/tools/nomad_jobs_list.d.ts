export type NomadJobsListInput = {
    text: string;
};
export type NomadJobsListOutput = {
    jobs: Array<{
        id?: string;
        type?: string;
        datacenters?: string[];
        namespace?: string;
    }>;
    count: number;
};
export declare function nomadJobsList(input: NomadJobsListInput): NomadJobsListOutput;
