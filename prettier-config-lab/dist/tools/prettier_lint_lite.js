import { lintPrettierConfig, parsePrettierConfigText, } from "../lib/prettier_config.js";
export function prettierLintLite(input) {
    const doc = parsePrettierConfigText(input.text ?? "");
    const findings = lintPrettierConfig(doc.raw, doc.parseError, doc.format);
    return { findings, findingCount: findings.length };
}
