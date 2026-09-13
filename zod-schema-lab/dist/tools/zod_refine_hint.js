import { listRefinements } from "../lib/zod_schema.js";
export function zodRefineHint(input) {
    return listRefinements(input.text ?? "");
}
