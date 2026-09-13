export type ToxEnvlistResult = {
    envlist: string[];
    expanded?: string[];
    count: number;
};
/**
 * From [tox] envlist= — best-effort expand simple py{310,311} style factors.
 */
export declare function toxEnvlist(args: {
    text: string;
}): ToxEnvlistResult;
