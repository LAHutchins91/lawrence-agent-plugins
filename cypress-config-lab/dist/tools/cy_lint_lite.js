import { lintCypressConfig, parseCypressConfigText, } from "../lib/cypress_config.js";
export function cyLintLite(input) {
    const doc = parseCypressConfigText(input.text ?? "");
    const findings = lintCypressConfig(doc.raw, doc.parseError, doc.format);
    return { findings, findingCount: findings.length };
}
