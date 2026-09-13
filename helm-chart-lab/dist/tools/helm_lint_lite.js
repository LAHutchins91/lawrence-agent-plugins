import { lintHelm } from "../lib/helm_heuristics.js";
export function helmLintLite(input) {
    const findings = lintHelm({
        combined: input.text,
        chartText: input.chartText,
        valuesText: input.valuesText,
        templatesText: input.templatesText,
    });
    return { findings, findingCount: findings.length };
}
