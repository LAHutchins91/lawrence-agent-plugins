import { type Finding } from "../lib/package.js";
export type PkgLintLiteInput = {
    text: string;
};
export type PkgLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function pkgLintLite(input: PkgLintLiteInput): PkgLintLiteOutput;
