import { extractRoles } from "../lib/ansible_heuristics.js";
export function ansibleRolesHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { roles: [], count: 0 };
    }
    const roles = extractRoles(text);
    return { roles, count: roles.length };
}
