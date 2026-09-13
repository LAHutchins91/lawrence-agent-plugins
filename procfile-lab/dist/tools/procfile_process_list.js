import { listProcesses } from "../lib/procfile.js";
export function procfileProcessList(input) {
    return listProcesses(input.text ?? "");
}
