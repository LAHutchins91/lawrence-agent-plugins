import { parseEntries } from "../lib/procfile.js";
export function procfileParse(input) {
    return parseEntries(input.text ?? "");
}
