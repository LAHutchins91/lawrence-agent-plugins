import { type TemplateInfo } from "../lib/sc_heuristics.js";
export type ScTemplatesHintInput = {
    text: string;
};
export type ScTemplatesHintOutput = {
    templates: TemplateInfo[];
    library?: string;
    count: number;
};
export declare function scTemplatesHint(input: ScTemplatesHintInput): ScTemplatesHintOutput;
