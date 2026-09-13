import { listMetadata } from "../lib/gc_heuristics.js";
export function gcMetadataHint(input) {
    return listMetadata(input.text ?? "");
}
