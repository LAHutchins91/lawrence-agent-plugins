export type KbPluginsHintInput = {
    text: string;
};
export type KbPluginsHintOutput = {
    plugins: string[];
    count: number;
};
export declare function kbPluginsHint(input: KbPluginsHintInput): KbPluginsHintOutput;
