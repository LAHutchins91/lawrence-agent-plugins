export type WpPluginsListInput = {
    text: string;
};
export type WpPluginsListOutput = {
    plugins: string[];
    count: number;
};
export declare function wpPluginsList(input: WpPluginsListInput): WpPluginsListOutput;
