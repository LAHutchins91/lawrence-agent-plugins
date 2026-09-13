export type PkgDepsDiffInput = {
    text: string;
};
export type PkgDepsDiffOutput = {
    dependencies: string[];
    devDependencies: string[];
    peerDependencies: string[];
    optionalDependencies: string[];
    onlyInDeps: string[];
    onlyInDev: string[];
    overlap: string[];
};
export declare function pkgDepsDiff(input: PkgDepsDiffInput): PkgDepsDiffOutput;
