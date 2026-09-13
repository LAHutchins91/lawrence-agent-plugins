import { asMap, extractEnvList, extractPlugins, parseEslintConfigText, } from "../lib/eslint_config.js";
export function eslintEnvParser(input) {
    const doc = parseEslintConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    const raw = doc.raw;
    const out = {};
    if (!raw)
        return out;
    const env = extractEnvList(raw);
    if (env.length)
        out.env = env;
    if (typeof raw.parser === "string" && raw.parser.trim()) {
        out.parser = raw.parser.trim();
    }
    const po = asMap(raw.parserOptions);
    if (po && Object.keys(po).length) {
        out.parserOptions = po;
    }
    const plugins = extractPlugins(raw);
    if (plugins.length)
        out.plugins = plugins;
    return out;
}
