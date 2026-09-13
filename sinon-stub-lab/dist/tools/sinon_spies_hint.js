import { listSpies } from "../lib/sinon_stubs.js";
export function sinonSpiesHint(input) {
    return listSpies(input.text ?? "");
}
