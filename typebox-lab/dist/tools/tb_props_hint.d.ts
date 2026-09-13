import { type PropInfo } from "../lib/typebox_schema.js";
export type TbPropsHintInput = {
    text: string;
};
export type TbPropsHintOutput = {
    props: PropInfo[];
    count: number;
};
export declare function tbPropsHint(input: TbPropsHintInput): TbPropsHintOutput;
