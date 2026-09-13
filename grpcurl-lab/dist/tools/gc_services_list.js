import { listServices } from "../lib/gc_heuristics.js";
export function gcServicesList(input) {
    return listServices(input.text ?? "");
}
