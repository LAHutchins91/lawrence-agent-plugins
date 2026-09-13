import { type HandlerInfo } from "../lib/msw_handlers.js";
export type MswHandlersListInput = {
    text: string;
};
export type MswHandlersListOutput = {
    handlers: HandlerInfo[];
    count: number;
};
export declare function mswHandlersList(input: MswHandlersListInput): MswHandlersListOutput;
