export type NomadGroupsHintInput = {
    text: string;
};
export type NomadGroupsHintOutput = {
    groups: Array<{
        name?: string;
        count?: number;
        networks?: Array<{
            ports?: string[];
            mode?: string;
        }>;
    }>;
    count: number;
};
export declare function nomadGroupsHint(input: NomadGroupsHintInput): NomadGroupsHintOutput;
