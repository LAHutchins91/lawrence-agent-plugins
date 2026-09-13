import { asMap, parsePackageText, pkgName } from "../lib/package.js";
export function pkgScriptsList(input) {
    const doc = parsePackageText(input.text ?? "");
    const name = pkgName(doc.raw);
    const scriptsMap = asMap(doc.raw?.scripts);
    const scripts = [];
    if (scriptsMap) {
        for (const [key, value] of Object.entries(scriptsMap)) {
            if (typeof value === "string") {
                scripts.push({ name: key, command: value });
            }
            else if (value !== undefined && value !== null) {
                scripts.push({ name: key, command: String(value) });
            }
        }
        scripts.sort((a, b) => a.name.localeCompare(b.name));
    }
    const out = { scripts, count: scripts.length };
    if (name !== undefined)
        out.name = name;
    return out;
}
