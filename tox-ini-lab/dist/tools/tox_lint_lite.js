import { getTestenvSections, getToxSection, looksLikeSecretPassenv, parsePassenv, parseToxIni, splitMultilineItems, testenvName, } from "../lib/toxini.js";
/**
 * Educational heuristic lite lint for tox.ini text.
 */
export function toxLintLite(args) {
    const findings = [];
    const parsed = parseToxIni(args.text ?? "");
    if (parsed.empty) {
        findings.push({
            severity: "error",
            rule: "empty_file",
            advice: "tox.ini text is empty — paste a full tox.ini to analyze.",
        });
        return { findings, findingCount: findings.length };
    }
    const tox = getToxSection(parsed);
    if (!tox) {
        findings.push({
            severity: "error",
            rule: "missing_tox_section",
            advice: "Add a [tox] section (typically with envlist=) so tox knows which environments to run.",
        });
    }
    else {
        const envlist = (tox.props["envlist"] ?? "").trim();
        if (!envlist) {
            findings.push({
                severity: "warning",
                rule: "missing_envlist",
                advice: " [tox] has no envlist= — set envlist to the environments you intend to run (or rely on isolated_build defaults carefully).",
            });
        }
        const skip = (tox.props["skip_missing_interpreters"] ?? "").trim().toLowerCase();
        if (!skip || skip === "false" || skip === "0" || skip === "no") {
            findings.push({
                severity: "info",
                rule: "skip_missing_interpreters",
                advice: "Consider skip_missing_interpreters = true so tox continues when some Python interpreters are absent on a machine.",
            });
        }
    }
    // Duplicate section headers (same exact name)
    const seenSections = new Map();
    for (const sec of parsed.sections) {
        const k = sec.key;
        if (seenSections.has(k)) {
            findings.push({
                severity: "warning",
                rule: "duplicate_env_section",
                advice: `Duplicate section [${sec.name}] (earlier at line ${seenSections.get(k)}, again at line ${sec.line}) — later keys override; consolidate to avoid confusion.`,
            });
        }
        else {
            seenSections.set(k, sec.line);
        }
    }
    const testenvs = getTestenvSections(parsed);
    if (testenvs.length === 0) {
        findings.push({
            severity: "warning",
            rule: "no_testenv",
            advice: "No [testenv] or [testenv:NAME] sections found — tox needs at least a base [testenv] with commands.",
        });
    }
    for (const sec of testenvs) {
        const name = testenvName(sec);
        const cmds = [
            ...splitMultilineItems(sec.props["commands_pre"] ?? ""),
            ...splitMultilineItems(sec.props["commands"] ?? ""),
            ...splitMultilineItems(sec.props["commands_post"] ?? ""),
        ];
        const hasCommandsKey = "commands" in sec.props ||
            "commands_pre" in sec.props ||
            "commands_post" in sec.props;
        // Only flag empty commands when the section defines commands= (or is the base
        // testenv without any command keys — still tip).
        if (hasCommandsKey && cmds.length === 0) {
            findings.push({
                severity: "warning",
                rule: "empty_commands",
                advice: `Section [${sec.name}] declares commands but the list is empty — add at least one command or remove the key.`,
            });
        }
        else if (sec.key !== "testenv" && !hasCommandsKey) {
            // named env with no commands and no inheritance visible via text — tip
            // Base [testenv] often holds shared commands; named envs inherit. Skip named
            // only if they have no commands key — that's normal inheritance.
        }
        else if (sec.key === "testenv" && !hasCommandsKey) {
            // Check if any named env has commands; if none do, warn
            const anyCmds = testenvs.some((s) => {
                const c = [
                    ...splitMultilineItems(s.props["commands_pre"] ?? ""),
                    ...splitMultilineItems(s.props["commands"] ?? ""),
                    ...splitMultilineItems(s.props["commands_post"] ?? ""),
                ];
                return c.length > 0;
            });
            if (!anyCmds) {
                findings.push({
                    severity: "warning",
                    rule: "empty_commands",
                    advice: `No commands found under [testenv] or [testenv:NAME] — tox environments need commands= to do work.`,
                });
            }
        }
        // usedevelop vs package
        const usedevelop = (sec.props["usedevelop"] ?? "").trim().toLowerCase();
        const packageVal = (sec.props["package"] ?? "").trim().toLowerCase();
        if ((usedevelop === "true" || usedevelop === "1" || usedevelop === "yes") &&
            packageVal &&
            packageVal !== "editable" &&
            packageVal !== "develop") {
            findings.push({
                severity: "warning",
                rule: "usedevelop_vs_package",
                advice: `[${sec.name}] sets usedevelop=${sec.props["usedevelop"]} together with package=${sec.props["package"]} — prefer a single packaging mode (tox 4: package=editable) to avoid conflicting install strategies.`,
            });
        }
        else if (usedevelop === "true" || usedevelop === "1" || usedevelop === "yes") {
            findings.push({
                severity: "info",
                rule: "usedevelop_vs_package",
                advice: `[${sec.name}] uses usedevelop — in tox 4 prefer package = editable (usedevelop is legacy).`,
            });
        }
        // passenv secret smells
        const passenvRaw = sec.props["passenv"] ?? "";
        if (passenvRaw.trim()) {
            for (const envName of parsePassenv(passenvRaw)) {
                if (looksLikeSecretPassenv(envName)) {
                    findings.push({
                        severity: "warning",
                        rule: "passenv_secret_smell",
                        advice: `[${sec.name}] passenv includes '${envName}' — avoid forwarding secrets into testenvs; prefer explicit fixtures or CI secret injection scoped to the job.`,
                    });
                }
            }
        }
        // setenv secret smells (values that look like inline secrets)
        const setenvRaw = sec.props["setenv"] ?? "";
        if (setenvRaw.trim()) {
            for (const line of setenvRaw.split("\n")) {
                const t = line.trim();
                if (!t)
                    continue;
                const eq = t.indexOf("=");
                if (eq === -1)
                    continue;
                const key = t.slice(0, eq).trim();
                const val = t.slice(eq + 1).trim();
                if (looksLikeSecretPassenv(key) && val && !val.startsWith("{") && val.length > 0) {
                    findings.push({
                        severity: "warning",
                        rule: "setenv_secret_smell",
                        advice: `[${sec.name}] setenv assigns '${key}' inline — do not hardcode secrets in tox.ini; use passenv from a secret store or CI.`,
                    });
                }
            }
        }
        void name;
    }
    // Deduplicate identical rule+advice pairs lightly
    const uniq = [];
    const seen = new Set();
    for (const f of findings) {
        const k = `${f.rule}::${f.advice}`;
        if (seen.has(k))
            continue;
        seen.add(k);
        uniq.push(f);
    }
    return { findings: uniq, findingCount: uniq.length };
}
