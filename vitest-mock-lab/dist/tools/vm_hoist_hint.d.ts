import { type HoistInfo } from "../lib/vitest_mocks.js";
export type VmHoistHintInput = {
    text: string;
};
export type VmHoistHintOutput = {
    hoisted: HoistInfo[];
    count: number;
};
export declare function vmHoistHint(input: VmHoistHintInput): VmHoistHintOutput;
