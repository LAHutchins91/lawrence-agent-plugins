import { listSelectors, } from "../lib/puppeteer_heuristics.js";
export function pptrSelectorsHint(input) {
    return listSelectors(input.text ?? "");
}
