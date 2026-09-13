import { extractBuilds } from "../lib/packer_heuristics.js";
export function packerBuildsList(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { builds: [], count: 0 };
    }
    const builds = extractBuilds(text);
    return { builds, count: builds.length };
}
