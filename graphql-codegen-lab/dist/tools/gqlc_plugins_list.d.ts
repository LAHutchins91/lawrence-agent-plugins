export type GqlcPluginsListInput = {
    text: string;
};
export type GqlcPluginsListOutput = {
    plugins: string[];
    generates?: string[];
    count: number;
};
export declare function gqlcPluginsList(input: GqlcPluginsListInput): GqlcPluginsListOutput;
