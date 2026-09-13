export type ToxDep = {
    env?: string;
    package: string;
};
export type ToxDepsListResult = {
    deps: ToxDep[];
    unique: string[];
    count: number;
};
/**
 * From deps = lines across [testenv] / [testenv:NAME].
 */
export declare function toxDepsList(args: {
    text: string;
}): ToxDepsListResult;
