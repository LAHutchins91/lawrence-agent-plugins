import { listDocuments } from "../lib/gqlc_heuristics.js";
export function gqlcDocumentsHint(input) {
    return listDocuments(input.text ?? "");
}
