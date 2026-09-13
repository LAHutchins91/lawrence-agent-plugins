import { extractBoxes } from "../lib/vagrant_heuristics.js";
export function vagrantBoxesList(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { boxes: [], count: 0 };
    }
    const boxes = extractBoxes(text);
    return { boxes, count: boxes.length };
}
