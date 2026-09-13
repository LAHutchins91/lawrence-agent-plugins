import { depKeys, parsePackageText } from "../lib/package.js";
export function pkgDepsDiff(input) {
    const doc = parsePackageText(input.text ?? "");
    const dependencies = depKeys(doc.raw, "dependencies");
    const devDependencies = depKeys(doc.raw, "devDependencies");
    const peerDependencies = depKeys(doc.raw, "peerDependencies");
    const optionalDependencies = depKeys(doc.raw, "optionalDependencies");
    const depSet = new Set(dependencies);
    const devSet = new Set(devDependencies);
    const onlyInDeps = dependencies.filter((n) => !devSet.has(n));
    const onlyInDev = devDependencies.filter((n) => !depSet.has(n));
    const overlap = dependencies.filter((n) => devSet.has(n));
    return {
        dependencies,
        devDependencies,
        peerDependencies,
        optionalDependencies,
        onlyInDeps,
        onlyInDev,
        overlap,
    };
}
