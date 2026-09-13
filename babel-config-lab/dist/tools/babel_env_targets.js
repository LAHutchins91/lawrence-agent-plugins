import { extractEnvTargets, parseBabelConfigText, } from "../lib/babel_config.js";
export function babelEnvTargets(input) {
    const doc = parseBabelConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    return extractEnvTargets(doc.raw);
}
