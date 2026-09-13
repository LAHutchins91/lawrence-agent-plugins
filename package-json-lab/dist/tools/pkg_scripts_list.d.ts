export type PkgScriptsListInput = {
    text: string;
};
export type ScriptEntry = {
    name: string;
    command: string;
};
export type PkgScriptsListOutput = {
    name?: string;
    scripts: ScriptEntry[];
    count: number;
};
export declare function pkgScriptsList(input: PkgScriptsListInput): PkgScriptsListOutput;
