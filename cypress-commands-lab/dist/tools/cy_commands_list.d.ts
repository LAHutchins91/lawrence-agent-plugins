import { type CommandInfo } from "../lib/cypress_commands.js";
export type CyCommandsListInput = {
    text: string;
};
export type CyCommandsListOutput = {
    commands: CommandInfo[];
    count: number;
};
export declare function cyCommandsList(input: CyCommandsListInput): CyCommandsListOutput;
