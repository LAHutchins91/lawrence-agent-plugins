import { type PluginsListResult } from "../lib/capacitor_config.js";
export type CapPluginsListInput = {
    text: string;
};
export type CapPluginsListOutput = PluginsListResult;
export declare function capPluginsList(input: CapPluginsListInput): CapPluginsListOutput;
