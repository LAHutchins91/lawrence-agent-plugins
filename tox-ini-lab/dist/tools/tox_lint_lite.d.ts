import { type Finding } from "../lib/toxini.js";
export type ToxLintLiteResult = {
    findings: Finding[];
    findingCount: number;
};
/**
 * Educational heuristic lite lint for tox.ini text.
 */
export declare function toxLintLite(args: {
    text: string;
}): ToxLintLiteResult;
