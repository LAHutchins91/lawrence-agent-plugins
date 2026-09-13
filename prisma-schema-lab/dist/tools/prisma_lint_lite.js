import { lintSchema } from "../lib/prisma_schema.js";
export function prismaLintLite(input) {
    const findings = lintSchema(input.text ?? "");
    return { findings, findingCount: findings.length };
}
