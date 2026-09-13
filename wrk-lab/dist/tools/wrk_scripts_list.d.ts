export type WrkScriptsListInput = {
    text: string;
};
export type WrkScriptsListOutput = {
    hooks: {
        name: string;
    }[];
    count: number;
};
export declare function wrkScriptsList(input: WrkScriptsListInput): WrkScriptsListOutput;
