import { extractClasses } from "../lib/puppet_heuristics.js";
export function puppetClassesList(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { classes: [], count: 0 };
    }
    const classes = extractClasses(text);
    return { classes, count: classes.length };
}
