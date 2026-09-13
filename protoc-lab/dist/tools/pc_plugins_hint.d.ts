import { type PluginInfo } from "../lib/pc_heuristics.js";
export type PcPluginsHintInput = {
    text: string;
};
export type PcPluginsHintOutput = {
    plugins: PluginInfo[];
    count: number;
};
export declare function pcPluginsHint(input: PcPluginsHintInput): PcPluginsHintOutput;
