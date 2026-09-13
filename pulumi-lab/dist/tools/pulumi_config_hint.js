import { extractConfig } from "../lib/pulumi_heuristics.js";
export function pulumiConfigHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { configKeys: [], count: 0 };
    }
    const { configKeys, secretKeys } = extractConfig(text);
    const out = {
        configKeys,
        count: configKeys.length,
    };
    if (secretKeys.length > 0)
        out.secretKeys = secretKeys;
    return out;
}
