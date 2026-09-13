import { type ComposeInfo } from "../lib/typebox_schema.js";
export type TbComposeHintInput = {
    text: string;
};
export type TbComposeHintOutput = {
    compose: ComposeInfo[];
    count: number;
};
export declare function tbComposeHint(input: TbComposeHintInput): TbComposeHintOutput;
