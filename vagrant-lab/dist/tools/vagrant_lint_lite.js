import { lintVagrant } from "../lib/vagrant_heuristics.js";
export function vagrantLintLite(input) {
    const findings = lintVagrant(input.text ?? "");
    return { findings, findingCount: findings.length };
}
