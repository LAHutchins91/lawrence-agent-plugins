import { extractEnvKeys, parseRailwayConfigText, } from "../lib/railway_config.js";
export function railwayEnvKeys(input) {
    const doc = parseRailwayConfigText(input.text ?? "");
    return extractEnvKeys(doc.raw);
}
