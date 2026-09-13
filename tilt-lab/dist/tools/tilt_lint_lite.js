import { lintTiltfile } from "../lib/tilt_heuristics.js";
export function tiltLintLite(input) {
    const findings = lintTiltfile(input.text ?? "");
    return { findings, findingCount: findings.length };
}
