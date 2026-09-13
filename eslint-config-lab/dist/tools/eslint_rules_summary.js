import { extractRules, parseEslintConfigText, } from "../lib/eslint_config.js";
function emptyCounts() {
    return { error: 0, warn: 0, off: 0, other: 0 };
}
export function eslintRulesSummary(input) {
    const doc = parseEslintConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    const rules = extractRules(doc.raw);
    const counts = emptyCounts();
    for (const r of rules) {
        const s = r.severity;
        if (s === "error" || s === "warn" || s === "off" || s === "other") {
            counts[s]++;
        }
        else {
            counts.other++;
        }
    }
    return { rules, counts, total: rules.length };
}
