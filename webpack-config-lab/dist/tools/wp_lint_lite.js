import { lintWebpackConfig, parseWebpackConfigText, } from "../lib/webpack_config.js";
export function wpLintLite(input) {
    const doc = parseWebpackConfigText(input.text ?? "");
    const findings = lintWebpackConfig(doc.raw, doc.parseError, doc.format, doc.source, doc.multiCompiler);
    return { findings, findingCount: findings.length };
}
