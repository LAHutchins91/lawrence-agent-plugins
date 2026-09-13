import { extractProvisioners } from "../lib/packer_heuristics.js";
export function packerProvisionersHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { provisioners: [], count: 0 };
    }
    const { provisioners, postProcessors } = extractProvisioners(text);
    const out = {
        provisioners,
        count: provisioners.length,
    };
    if (postProcessors.length)
        out.postProcessors = postProcessors;
    return out;
}
