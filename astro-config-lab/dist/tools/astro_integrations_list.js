import { extractIntegrations, parseAstroConfigText, } from "../lib/astro_config.js";
export function astroIntegrationsList(input) {
    const doc = parseAstroConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    return extractIntegrations(doc.raw, doc.source);
}
