import { listPlans } from "../lib/jmeter_heuristics.js";
export function jmxPlansList(input) {
    return listPlans(input.text ?? "");
}
