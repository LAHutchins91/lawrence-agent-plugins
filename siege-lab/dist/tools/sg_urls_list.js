import { listUrls } from "../lib/sg_heuristics.js";
export function sgUrlsList(input) {
    return listUrls(input.text ?? "");
}
