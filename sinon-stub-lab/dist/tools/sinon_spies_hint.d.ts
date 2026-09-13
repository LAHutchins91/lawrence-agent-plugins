import { type SpyInfo } from "../lib/sinon_stubs.js";
export type SinonSpiesHintInput = {
    text: string;
};
export type SinonSpiesHintOutput = {
    spies: SpyInfo[];
    count: number;
};
export declare function sinonSpiesHint(input: SinonSpiesHintInput): SinonSpiesHintOutput;
