import { type OverrideEntry } from "../lib/prettier_config.js";
export type PrettierOverridesListInput = {
    text: string;
};
export type PrettierOverridesListOutput = {
    overrides: OverrideEntry[];
    count: number;
};
export declare function prettierOverridesList(input: PrettierOverridesListInput): PrettierOverridesListOutput;
