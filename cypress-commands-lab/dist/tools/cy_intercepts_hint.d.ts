import { type InterceptInfo } from "../lib/cypress_commands.js";
export type CyInterceptsHintInput = {
    text: string;
};
export type CyInterceptsHintOutput = {
    intercepts: InterceptInfo[];
    count: number;
};
export declare function cyInterceptsHint(input: CyInterceptsHintInput): CyInterceptsHintOutput;
