export type EslintEnvParserInput = {
    text: string;
};
export type EslintEnvParserOutput = {
    env?: string[];
    parser?: string;
    parserOptions?: Record<string, unknown>;
    plugins?: string[];
};
export declare function eslintEnvParser(input: EslintEnvParserInput): EslintEnvParserOutput;
