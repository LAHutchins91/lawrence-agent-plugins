import { normalizeTriggers, parseWorkflowText } from "../lib/workflow.js";
export function ghaListTriggers(input) {
    const doc = parseWorkflowText(input.text ?? "");
    if (doc.parseError) {
        return { on: null, events: [], error: doc.parseError };
    }
    const onVal = doc.raw ? doc.raw.on : null;
    const { on, events } = normalizeTriggers(onVal);
    return { on, events };
}
