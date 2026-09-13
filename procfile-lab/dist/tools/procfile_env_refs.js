import { listEnvRefs } from "../lib/procfile.js";
export function procfileEnvRefs(input) {
    return listEnvRefs(input.text ?? "");
}
