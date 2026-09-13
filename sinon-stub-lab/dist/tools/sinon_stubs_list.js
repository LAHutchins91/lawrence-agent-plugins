import { listStubs } from "../lib/sinon_stubs.js";
export function sinonStubsList(input) {
    return listStubs(input.text ?? "");
}
