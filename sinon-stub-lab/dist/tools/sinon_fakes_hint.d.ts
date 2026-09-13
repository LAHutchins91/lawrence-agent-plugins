import { type FakeInfo } from "../lib/sinon_stubs.js";
export type SinonFakesHintInput = {
    text: string;
};
export type SinonFakesHintOutput = {
    fakes: FakeInfo[];
    count: number;
};
export declare function sinonFakesHint(input: SinonFakesHintInput): SinonFakesHintOutput;
