import { lintPostcssConfig, parsePostcssConfigText, } from "../lib/postcss_config.js";
export function postcssLintLite(input) {
    const doc = parsePostcssConfigText(input.text ?? "");
    const findings = lintPostcssConfig(doc.raw, doc.parseError, doc.format, doc.source, doc.unwrappedPackagePostcss);
    return { findings, findingCount: findings.length };
}
