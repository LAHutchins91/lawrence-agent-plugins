import { lintVercelJson, parseVercelJsonText, } from "../lib/vercel_json.js";
export function vercelLintLite(input) {
    const doc = parseVercelJsonText(input.text ?? "");
    const findings = lintVercelJson(doc.raw, doc.parseError, doc.format);
    return { findings, findingCount: findings.length };
}
