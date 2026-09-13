import { lintAppSpec, parseAppSpecText, } from "../lib/app_spec.js";
export function doLintLite(input) {
    const doc = parseAppSpecText(input.text ?? "");
    const findings = lintAppSpec(doc);
    return { findings, findingCount: findings.length };
}
