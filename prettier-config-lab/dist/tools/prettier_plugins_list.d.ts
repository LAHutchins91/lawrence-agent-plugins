export type PrettierPluginsListInput = {
    text: string;
};
export type PrettierPluginsListOutput = {
    plugins: string[];
    count: number;
};
export declare function prettierPluginsList(input: PrettierPluginsListInput): PrettierPluginsListOutput;
