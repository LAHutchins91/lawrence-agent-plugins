import { lintEntities } from "../lib/typeorm_entity.js";
export function typeormLintLite(input) {
    const findings = lintEntities(input.text ?? "");
    return { findings, findingCount: findings.length };
}
