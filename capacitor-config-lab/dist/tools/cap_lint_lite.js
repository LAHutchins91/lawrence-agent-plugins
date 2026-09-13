import { lintCapacitorConfig, parseCapacitorConfigText, } from "../lib/capacitor_config.js";
export function capLintLite(input) {
    const doc = parseCapacitorConfigText(input.text ?? "");
    const findings = lintCapacitorConfig(doc.raw, doc.parseError, doc.format, doc.source);
    return { findings, findingCount: findings.length };
}
