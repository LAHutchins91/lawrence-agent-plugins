import { lintExpoConfig, parseExpoConfigText, } from "../lib/expo_config.js";
export function expoLintLite(input) {
    const doc = parseExpoConfigText(input.text ?? "");
    const findings = lintExpoConfig(doc.expo, doc.parseError, doc.format, doc.source);
    return { findings, findingCount: findings.length };
}
