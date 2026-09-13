import { listPhony } from "../lib/makefile.js";
export function makePhonyList(input) {
    return listPhony(input.text ?? "");
}
