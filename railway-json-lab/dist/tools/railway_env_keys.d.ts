export type RailwayEnvKeysInput = {
    text: string;
};
export type RailwayEnvKeysOutput = {
    keys: string[];
    count: number;
    redacted?: string[];
};
export declare function railwayEnvKeys(input: RailwayEnvKeysInput): RailwayEnvKeysOutput;
