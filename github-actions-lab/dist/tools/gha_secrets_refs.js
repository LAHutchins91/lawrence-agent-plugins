import { findSecretRefs } from "../lib/workflow.js";
/**
 * Extract secrets.NAME / ${{ secrets.NAME }} refs — names only, never values.
 */
export function ghaSecretsRefs(input) {
    const secrets = findSecretRefs(input.text ?? "");
    return { secrets, count: secrets.length };
}
