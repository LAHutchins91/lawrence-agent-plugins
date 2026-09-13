import { extractTestMatch, parseJestConfigText, } from "../lib/jest_config.js";
export function jestTestMatch(input) {
    const doc = parseJestConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    return extractTestMatch(doc.raw);
}
