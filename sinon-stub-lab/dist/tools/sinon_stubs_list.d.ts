import { type StubInfo } from "../lib/sinon_stubs.js";
export type SinonStubsListInput = {
    text: string;
};
export type SinonStubsListOutput = {
    stubs: StubInfo[];
    count: number;
};
export declare function sinonStubsList(input: SinonStubsListInput): SinonStubsListOutput;
