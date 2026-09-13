import { type EventInfo } from "../lib/testing_library_heuristics.js";
export type TlEventsHintInput = {
    text: string;
};
export type TlEventsHintOutput = {
    events: EventInfo[];
    count: number;
};
export declare function tlEventsHint(input: TlEventsHintInput): TlEventsHintOutput;
