import { listWaits } from "../lib/puppeteer_heuristics.js";
export function pptrWaitHint(input) {
    return listWaits(input.text ?? "");
}
