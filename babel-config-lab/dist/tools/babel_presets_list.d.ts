import { type PresetListResult } from "../lib/babel_config.js";
export type BabelPresetsListInput = {
    text: string;
};
export type BabelPresetsListOutput = PresetListResult;
export declare function babelPresetsList(input: BabelPresetsListInput): BabelPresetsListOutput;
