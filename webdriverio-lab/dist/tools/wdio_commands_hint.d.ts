import { type CommandInfo } from "../lib/wdio_heuristics.js";
export type WdioCommandsHintInput = {
    text: string;
};
export type WdioCommandsHintOutput = {
    commands: CommandInfo[];
    count: number;
};
export declare function wdioCommandsHint(input: WdioCommandsHintInput): WdioCommandsHintOutput;
