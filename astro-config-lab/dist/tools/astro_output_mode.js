import { extractOutputMode, parseAstroConfigText, } from "../lib/astro_config.js";
export function astroOutputMode(input) {
    const doc = parseAstroConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    return extractOutputMode(doc.raw, doc.source);
}
