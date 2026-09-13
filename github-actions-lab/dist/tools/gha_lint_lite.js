import { lintWorkflow, parseWorkflowText, } from "../lib/workflow.js";
export function ghaLintLite(input) {
    const doc = parseWorkflowText(input.text ?? "");
    const findings = lintWorkflow(input.text ?? "", doc.raw, doc.parseError);
    return { findings, findingCount: findings.length };
}
