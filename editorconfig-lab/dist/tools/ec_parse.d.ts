export type EcParseInput = {
    text: string;
};
export type EcParseOutput = {
    root?: boolean;
    sections: Array<{
        name: string;
        glob?: string;
        properties: Record<string, string>;
    }>;
    sectionCount: number;
};
export declare function ecParse(input: EcParseInput): EcParseOutput;
