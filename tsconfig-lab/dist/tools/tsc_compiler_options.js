import { compilerOptionsMap, parseTsconfigText } from "../lib/tsconfig.js";
export function tscCompilerOptions(input) {
    const doc = parseTsconfigText(input.text ?? "");
    if (doc.parseError) {
        throw new Error(doc.parseError);
    }
    const compilerOptions = compilerOptionsMap(doc.raw);
    const keys = Object.keys(compilerOptions).sort();
    return { compilerOptions, keys };
}
