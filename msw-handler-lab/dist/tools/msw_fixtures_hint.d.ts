import { type FixtureInfo } from "../lib/msw_handlers.js";
export type MswFixturesHintInput = {
    text: string;
};
export type MswFixturesHintOutput = {
    fixtures: FixtureInfo[];
    count: number;
};
export declare function mswFixturesHint(input: MswFixturesHintInput): MswFixturesHintOutput;
