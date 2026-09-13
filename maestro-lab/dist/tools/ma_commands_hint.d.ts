import { type CommandFreq } from "../lib/maestro_heuristics.js";
export type MaCommandsHintInput = {
    text: string;
};
export type MaCommandsHintOutput = {
    commands: CommandFreq[];
    total: number;
};
export declare function maCommandsHint(input: MaCommandsHintInput): MaCommandsHintOutput;
