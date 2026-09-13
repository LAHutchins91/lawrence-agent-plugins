import { extractExtends, parseEslintConfigText } from "../lib/eslint_config.js";
export function eslintExtendsList(input) {
    const doc = parseEslintConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    const extendsList = extractExtends(doc.raw);
    return { extends: extendsList, count: extendsList.length };
}
