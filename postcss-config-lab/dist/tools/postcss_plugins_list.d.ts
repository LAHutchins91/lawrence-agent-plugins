import { type PluginListResult } from "../lib/postcss_config.js";
export type PostcssPluginsListInput = {
    text: string;
};
export type PostcssPluginsListOutput = PluginListResult;
export declare function postcssPluginsList(input: PostcssPluginsListInput): PostcssPluginsListOutput;
