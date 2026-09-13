import { diffSections } from "../lib/editorconfig.js";
export function ecDiffSections(input) {
    return diffSections(input.textA ?? "", input.textB ?? "");
}
