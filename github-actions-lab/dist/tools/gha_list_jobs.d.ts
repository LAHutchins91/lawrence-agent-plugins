export type GhaListJobsInput = {
    text: string;
};
export type GhaListJobsOutput = {
    name?: string;
    jobs: {
        id: string;
        name?: string;
        runsOn?: string;
        stepsCount?: number;
    }[];
    count: number;
    error?: string;
};
export declare function ghaListJobs(input: GhaListJobsInput): GhaListJobsOutput;
