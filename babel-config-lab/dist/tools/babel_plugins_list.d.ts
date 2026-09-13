import { type PluginListResult } from "../lib/babel_config.js";
export type BabelPluginsListInput = {
    text: string;
};
export type BabelPluginsListOutput = PluginListResult;
export declare function babelPluginsList(input: BabelPluginsListInput): BabelPluginsListOutput;
