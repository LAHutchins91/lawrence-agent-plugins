import { extractVars } from "../lib/ansible_heuristics.js";
export function ansibleVarsHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { vars: [], count: 0 };
    }
    const hint = extractVars(text);
    const out = {
        vars: hint.vars,
        count: hint.vars.length,
    };
    if (hint.secretKeyNames.length)
        out.secretKeyNames = hint.secretKeyNames;
    if (hint.varsFiles.length)
        out.varsFiles = hint.varsFiles;
    return out;
}
