import { type EnvKeysSummary } from "../lib/cypress_config.js";
export type CyEnvKeysInput = {
    text: string;
};
export type CyEnvKeysOutput = EnvKeysSummary;
export declare function cyEnvKeys(input: CyEnvKeysInput): CyEnvKeysOutput;
