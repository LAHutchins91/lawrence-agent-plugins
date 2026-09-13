import { type ActionInfo } from "../lib/valibot_schema.js";
export type VbActionsHintInput = {
    text: string;
};
export type VbActionsHintOutput = {
    actions: ActionInfo[];
    total: number;
};
export declare function vbActionsHint(input: VbActionsHintInput): VbActionsHintOutput;
