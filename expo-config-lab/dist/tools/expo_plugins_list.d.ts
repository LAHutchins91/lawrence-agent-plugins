import { type PluginsListResult } from "../lib/expo_config.js";
export type ExpoPluginsListInput = {
    text: string;
};
export type ExpoPluginsListOutput = PluginsListResult;
export declare function expoPluginsList(input: ExpoPluginsListInput): ExpoPluginsListOutput;
