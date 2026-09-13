import { type EnvTargetsResult } from "../lib/babel_config.js";
export type BabelEnvTargetsInput = {
    text: string;
};
export type BabelEnvTargetsOutput = EnvTargetsResult;
export declare function babelEnvTargets(input: BabelEnvTargetsInput): BabelEnvTargetsOutput;
