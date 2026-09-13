import { extractEvents } from "../lib/sam_heuristics.js";
export function samEventsHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { events: [], count: 0 };
    }
    const events = extractEvents(text);
    return { events, count: events.length };
}
