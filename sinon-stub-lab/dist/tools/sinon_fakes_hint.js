import { listFakes } from "../lib/sinon_stubs.js";
export function sinonFakesHint(input) {
    return listFakes(input.text ?? "");
}
