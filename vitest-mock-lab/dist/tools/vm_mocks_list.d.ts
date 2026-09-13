import { type MockInfo } from "../lib/vitest_mocks.js";
export type VmMocksListInput = {
    text: string;
};
export type VmMocksListOutput = {
    mocks: MockInfo[];
    count: number;
};
export declare function vmMocksList(input: VmMocksListInput): VmMocksListOutput;
