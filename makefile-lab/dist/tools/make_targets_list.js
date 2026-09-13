import { listTargets } from "../lib/makefile.js";
export function makeTargetsList(input) {
    return listTargets(input.text ?? "");
}
