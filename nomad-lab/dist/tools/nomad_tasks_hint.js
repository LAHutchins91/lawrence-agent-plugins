import { extractTasks } from "../lib/nomad_heuristics.js";
export function nomadTasksHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { tasks: [], count: 0 };
    }
    const { tasks, secretKeyNames } = extractTasks(text);
    const out = {
        tasks,
        count: tasks.length,
    };
    if (secretKeyNames.length)
        out.secretKeyNames = secretKeyNames;
    return out;
}
