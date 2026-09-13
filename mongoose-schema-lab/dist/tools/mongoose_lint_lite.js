import { lintMongoose } from "../lib/mongoose_schema.js";
export function mongooseLintLite(input) {
    const findings = lintMongoose(input.text ?? "");
    return { findings, findingCount: findings.length };
}
