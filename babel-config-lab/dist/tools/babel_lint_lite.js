import { lintBabelConfig, parseBabelConfigText, } from "../lib/babel_config.js";
export function babelLintLite(input) {
    const doc = parseBabelConfigText(input.text ?? "");
    const findings = lintBabelConfig(doc.raw, doc.parseError, doc.format, doc.source, doc.unwrappedPackageBabel);
    return { findings, findingCount: findings.length };
}
