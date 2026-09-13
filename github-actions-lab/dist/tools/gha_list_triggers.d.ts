export type GhaListTriggersInput = {
    text: string;
};
export type GhaListTriggersOutput = {
    on: unknown;
    events: string[];
    error?: string;
};
export declare function ghaListTriggers(input: GhaListTriggersInput): GhaListTriggersOutput;
