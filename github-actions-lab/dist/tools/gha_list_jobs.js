import { listJobs, parseWorkflowText } from "../lib/workflow.js";
export function ghaListJobs(input) {
    const doc = parseWorkflowText(input.text ?? "");
    const { name, jobs } = listJobs(doc.raw);
    const out = {
        ...(name ? { name } : {}),
        jobs,
        count: jobs.length,
    };
    if (doc.parseError)
        out.error = doc.parseError;
    return out;
}
