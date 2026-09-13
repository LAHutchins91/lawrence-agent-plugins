export type KbHooksHintInput = {
    text: string;
};
export type KbHooksHintOutput = {
    hooks: Array<{
        name?: string;
        command?: string;
    }>;
    count: number;
};
export declare function kbHooksHint(input: KbHooksHintInput): KbHooksHintOutput;
