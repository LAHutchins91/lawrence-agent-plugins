import { extractProjects, parseJestConfigText, } from "../lib/jest_config.js";
export function jestProjectsList(input) {
    const doc = parseJestConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    return extractProjects(doc.raw);
}
