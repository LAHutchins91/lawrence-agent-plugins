import { listServices, parseAppSpecText } from "../lib/app_spec.js";
export function doServicesList(input) {
    const doc = parseAppSpecText(input.text ?? "");
    return listServices(doc);
}
