import { listLanguages } from "../lib/sc_heuristics.js";
export function scLanguagesList(input) {
    return listLanguages(input.text ?? "");
}
