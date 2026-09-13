import { lintMakefile } from "../lib/makefile.js";
export function makeLintLite(input) {
    const findings = lintMakefile(input.text ?? "");
    return { findings, findingCount: findings.length };
}
