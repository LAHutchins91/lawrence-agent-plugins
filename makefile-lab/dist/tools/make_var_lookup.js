import { lookupVars } from "../lib/makefile.js";
export function makeVarLookup(input) {
    const name = typeof input.name === "string" && input.name.length > 0
        ? input.name
        : undefined;
    return lookupVars(input.text ?? "", name);
}
