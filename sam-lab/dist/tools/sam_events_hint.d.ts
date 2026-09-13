import { type EventInfo } from "../lib/sam_heuristics.js";
export type SamEventsHintInput = {
    text: string;
};
export type SamEventsHintOutput = {
    events: EventInfo[];
    count: number;
};
export declare function samEventsHint(input: SamEventsHintInput): SamEventsHintOutput;
