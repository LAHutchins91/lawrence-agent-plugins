import { type TriggerInfo } from "../lib/tilt_heuristics.js";
export type TiltTriggersHintInput = {
    text: string;
};
export type TiltTriggersHintOutput = {
    triggers: TriggerInfo[];
    count: number;
};
export declare function tiltTriggersHint(input: TiltTriggersHintInput): TiltTriggersHintOutput;
