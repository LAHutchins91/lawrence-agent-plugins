export type JmxPlansListInput = {
    text: string;
};
export type JmxPlansListOutput = {
    testPlans: {
        name?: string;
    }[];
    threadGroups: {
        name?: string;
        numThreads?: string;
        rampTime?: string;
    }[];
    count: number;
};
export declare function jmxPlansList(input: JmxPlansListInput): JmxPlansListOutput;
