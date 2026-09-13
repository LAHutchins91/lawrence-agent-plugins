import { parseExtends, parseTsconfigText } from "../lib/tsconfig.js";
/**
 * Report extends as declared strings only — do not fetch/read files.
 */
export function tscExtendsChain(input) {
    const doc = parseTsconfigText(input.text ?? "");
    if (doc.parseError) {
        throw new Error(doc.parseError);
    }
    return parseExtends(doc.raw);
}
