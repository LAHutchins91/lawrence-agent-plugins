import { type MapOptionsResult } from "../lib/postcss_config.js";
export type PostcssMapOptionsInput = {
    text: string;
};
export type PostcssMapOptionsOutput = MapOptionsResult;
export declare function postcssMapOptions(input: PostcssMapOptionsInput): PostcssMapOptionsOutput;
