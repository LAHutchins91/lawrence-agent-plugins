import { listScenarios } from "../lib/gatling_heuristics.js";
export function gatScenariosList(input) {
    return listScenarios(input.text ?? "");
}
