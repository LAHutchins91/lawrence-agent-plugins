import { lintEditorConfig } from "../lib/editorconfig.js";
export function ecLintLite(input) {
    const findings = lintEditorConfig(input.text ?? "");
    return { findings, findingCount: findings.length };
}
