import { lintTsconfig, parseTsconfigText, } from "../lib/tsconfig.js";
export function tscLintLite(input) {
    const doc = parseTsconfigText(input.text ?? "");
    const findings = lintTsconfig(doc.raw, doc.parseError);
    return { findings, findingCount: findings.length };
}
