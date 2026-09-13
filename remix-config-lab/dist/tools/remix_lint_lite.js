import { lintRemixConfig, parseRemixConfigText, } from "../lib/remix_config.js";
export function remixLintLite(input) {
    const doc = parseRemixConfigText(input.text ?? "");
    const findings = lintRemixConfig(doc.raw, doc.parseError, doc.format, doc.source, doc.flavor);
    return { findings, findingCount: findings.length };
}
