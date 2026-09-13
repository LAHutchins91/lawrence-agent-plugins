import { type AliasInfo } from "../lib/cypress_commands.js";
export type CyAliasesHintInput = {
    text: string;
};
export type CyAliasesHintOutput = {
    aliases: AliasInfo[];
    count: number;
};
export declare function cyAliasesHint(input: CyAliasesHintInput): CyAliasesHintOutput;
