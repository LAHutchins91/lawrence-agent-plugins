export type WrkLuaHintInput = {
    text: string;
};
export type WrkLuaHintOutput = {
    wrkUses: {
        api: string;
    }[];
    count: number;
};
export declare function wrkLuaHint(input: WrkLuaHintInput): WrkLuaHintOutput;
