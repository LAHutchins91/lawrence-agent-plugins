import { lintCypressCommands } from "../lib/cypress_commands.js";
export function cyLintLite(input) {
    const findings = lintCypressCommands(input.text ?? "");
    return { findings, findingCount: findings.length };
}
