import { compilerOptionsMap, normalizePaths, parseTsconfigText, } from "../lib/tsconfig.js";
export function tscPathsMap(input) {
    const doc = parseTsconfigText(input.text ?? "");
    if (doc.parseError) {
        throw new Error(doc.parseError);
    }
    const co = compilerOptionsMap(doc.raw);
    const paths = normalizePaths(co.paths);
    const aliases = Object.keys(paths).sort();
    const out = { paths, aliases };
    if (typeof co.baseUrl === "string" && co.baseUrl.trim() !== "") {
        out.baseUrl = co.baseUrl;
    }
    return out;
}
