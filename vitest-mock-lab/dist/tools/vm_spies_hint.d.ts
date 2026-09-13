import { type SpyInfo } from "../lib/vitest_mocks.js";
export type VmSpiesHintInput = {
    text: string;
};
export type VmSpiesHintOutput = {
    spies: SpyInfo[];
    count: number;
};
export declare function vmSpiesHint(input: VmSpiesHintInput): VmSpiesHintOutput;
