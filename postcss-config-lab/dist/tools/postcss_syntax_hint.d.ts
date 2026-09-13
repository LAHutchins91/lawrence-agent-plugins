import { type SyntaxHintResult } from "../lib/postcss_config.js";
export type PostcssSyntaxHintInput = {
    text: string;
};
export type PostcssSyntaxHintOutput = SyntaxHintResult;
export declare function postcssSyntaxHint(input: PostcssSyntaxHintInput): PostcssSyntaxHintOutput;
