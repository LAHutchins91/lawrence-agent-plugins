import { lintAstroConfig, parseAstroConfigText, } from "../lib/astro_config.js";
export function astroLintLite(input) {
    const doc = parseAstroConfigText(input.text ?? "");
    const findings = lintAstroConfig(doc.raw, doc.parseError, doc.format, doc.source);
    return { findings, findingCount: findings.length };
}
