import { extractCoverage, parseJestConfigText, } from "../lib/jest_config.js";
export function jestCoverageSummary(input) {
    const doc = parseJestConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    return extractCoverage(doc.raw);
}
