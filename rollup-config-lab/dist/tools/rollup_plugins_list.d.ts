export type RollupPluginsListInput = {
    text: string;
};
export type RollupPluginsListOutput = {
    plugins: string[];
    count: number;
};
export declare function rollupPluginsList(input: RollupPluginsListInput): RollupPluginsListOutput;
