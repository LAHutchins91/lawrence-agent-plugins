import { lintRailwayConfig, parseRailwayConfigText, } from "../lib/railway_config.js";
export function railwayLintLite(input) {
    const doc = parseRailwayConfigText(input.text ?? "");
    const findings = lintRailwayConfig(doc.raw, doc.parseError, doc.format);
    return { findings, findingCount: findings.length };
}
