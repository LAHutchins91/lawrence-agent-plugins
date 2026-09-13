import { extractEnvKeys } from "../lib/app_spec.js";
export type DoEnvKeysInput = {
    text: string;
};
export type DoEnvKeysOutput = ReturnType<typeof extractEnvKeys>;
export declare function doEnvKeys(input: DoEnvKeysInput): DoEnvKeysOutput;
