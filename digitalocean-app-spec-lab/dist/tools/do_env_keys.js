import { extractEnvKeys, parseAppSpecText } from "../lib/app_spec.js";
export function doEnvKeys(input) {
    const doc = parseAppSpecText(input.text ?? "");
    return extractEnvKeys(doc);
}
