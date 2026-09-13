import { extractJobs } from "../lib/nomad_heuristics.js";
export function nomadJobsList(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { jobs: [], count: 0 };
    }
    const jobs = extractJobs(text);
    return { jobs, count: jobs.length };
}
