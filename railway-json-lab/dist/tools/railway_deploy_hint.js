import { extractDeployHint, parseRailwayConfigText, } from "../lib/railway_config.js";
export function railwayDeployHint(input) {
    const doc = parseRailwayConfigText(input.text ?? "");
    return extractDeployHint(doc.raw);
}
