import { extractServices, parseRailwayConfigText, } from "../lib/railway_config.js";
export function railwayServicesList(input) {
    const doc = parseRailwayConfigText(input.text ?? "");
    return extractServices(doc.raw);
}
