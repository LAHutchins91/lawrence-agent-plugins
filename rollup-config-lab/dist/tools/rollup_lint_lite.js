import { lintRollupConfig, parseRollupConfigText, } from "../lib/rollup_config.js";
export function rollupLintLite(input) {
    const doc = parseRollupConfigText(input.text ?? "");
    const findings = lintRollupConfig(doc.raw, doc.parseError, doc.format, doc.source, doc.multiConfig);
    return { findings, findingCount: findings.length };
}
