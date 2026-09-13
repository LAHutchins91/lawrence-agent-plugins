import { listPages } from "../lib/puppeteer_heuristics.js";
export function pptrPagesList(input) {
    return listPages(input.text ?? "");
}
