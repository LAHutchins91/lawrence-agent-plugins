import { listWaits } from "../lib/testing_library_heuristics.js";
export function tlWaitHint(input) {
    return listWaits(input.text ?? "");
}
