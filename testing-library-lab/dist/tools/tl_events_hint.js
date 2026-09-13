import { listEvents } from "../lib/testing_library_heuristics.js";
export function tlEventsHint(input) {
    return listEvents(input.text ?? "");
}
