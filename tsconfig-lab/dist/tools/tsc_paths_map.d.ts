export type TscPathsMapInput = {
    text: string;
};
export type TscPathsMapOutput = {
    baseUrl?: string;
    paths: Record<string, string[]>;
    aliases: string[];
};
export declare function tscPathsMap(input: TscPathsMapInput): TscPathsMapOutput;
