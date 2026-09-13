export type PkgEnginesCheckInput = {
    text: string;
    nodeVersion?: string;
};
export type PkgEnginesCheckOutput = {
    engines?: Record<string, string>;
    satisfies?: boolean;
    notes: string[];
};
export declare function pkgEnginesCheck(input: PkgEnginesCheckInput): PkgEnginesCheckOutput;
