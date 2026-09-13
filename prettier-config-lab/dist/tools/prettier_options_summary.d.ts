export type PrettierOptionsSummaryInput = {
    text: string;
};
export type PrettierOptionsSummaryOutput = {
    options: Record<string, unknown>;
    keys: string[];
};
export declare function prettierOptionsSummary(input: PrettierOptionsSummaryInput): PrettierOptionsSummaryOutput;
