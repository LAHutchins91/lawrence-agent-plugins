import { getTestenvSections, parseToxIni, splitMultilineItems, testenvName, } from "../lib/toxini.js";
/**
 * From [testenv] / [testenv:NAME] commands / commands_pre / commands_post (multiline).
 * Order: commands_pre, then commands, then commands_post.
 */
export function toxCommandsMap(args) {
    const parsed = parseToxIni(args.text ?? "");
    const sections = getTestenvSections(parsed);
    const envs = [];
    for (const sec of sections) {
        const pre = splitMultilineItems(sec.props["commands_pre"] ?? "");
        const cmds = splitMultilineItems(sec.props["commands"] ?? "");
        const post = splitMultilineItems(sec.props["commands_post"] ?? "");
        const commands = [...pre, ...cmds, ...post];
        // Include env even if empty commands — callers may want the name inventory;
        // but prefer only envs that declare at least one of the command keys or are named.
        // Spec: map from those keys — include section if any command-related key exists OR always.
        // Include all testenv sections; empty commands array is fine.
        envs.push({ name: testenvName(sec), commands });
    }
    return { envs, count: envs.length };
}
