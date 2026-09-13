import { lintPackage, parsePackageText } from "../lib/package.js";
export function pkgLintLite(input) {
    const doc = parsePackageText(input.text ?? "");
    const findings = lintPackage(input.text ?? "", doc.raw, doc.parseError);
    return { findings, findingCount: findings.length };
}
