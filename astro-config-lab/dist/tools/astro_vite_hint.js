import { extractViteHint, parseAstroConfigText, } from "../lib/astro_config.js";
export function astroViteHint(input) {
    const doc = parseAstroConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    return extractViteHint(doc.raw, doc.source);
}
