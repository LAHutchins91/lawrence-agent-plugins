export type NomadTasksHintInput = {
    text: string;
};
export type NomadTasksHintOutput = {
    tasks: Array<{
        name?: string;
        driver?: string;
        image?: string;
    }>;
    secretKeyNames?: string[];
    count: number;
};
export declare function nomadTasksHint(input: NomadTasksHintInput): NomadTasksHintOutput;
