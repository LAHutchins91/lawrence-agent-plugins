import { lintWranglerToml, parseWranglerTomlText, } from "../lib/wrangler_toml.js";
export function wranglerLintLite(input) {
    const doc = parseWranglerTomlText(input.text ?? "");
    const findings = lintWranglerToml(doc.raw, doc.parseError, doc.format, doc.source);
    return { findings, findingCount: findings.length };
}
