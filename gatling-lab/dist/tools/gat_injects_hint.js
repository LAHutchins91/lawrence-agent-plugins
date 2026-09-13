import { listInjects } from "../lib/gatling_heuristics.js";
export function gatInjectsHint(input) {
    return listInjects(input.text ?? "");
}
