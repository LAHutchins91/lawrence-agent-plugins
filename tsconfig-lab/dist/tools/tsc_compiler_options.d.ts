export type TscCompilerOptionsInput = {
    text: string;
};
export type TscCompilerOptionsOutput = {
    compilerOptions: Record<string, unknown>;
    keys: string[];
};
export declare function tscCompilerOptions(input: TscCompilerOptionsInput): TscCompilerOptionsOutput;
