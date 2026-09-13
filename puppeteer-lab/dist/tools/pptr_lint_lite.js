import { lintPuppeteer } from "../lib/puppeteer_heuristics.js";
export function pptrLintLite(input) {
    const findings = lintPuppeteer(input.text ?? "");
    return { findings, findingCount: findings.length };
}
