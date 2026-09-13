import { listRules } from "../lib/joi_schema.js";
export function joiRulesHint(input) {
    return listRules(input.text ?? "");
}
