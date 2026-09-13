/**
 * Shared GitHub Actions workflow YAML text helpers.
 * String/YAML analysis only — no GitHub API, no network.
 */
import { parseDocument } from "yaml";
export function asMap(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value;
    }
    return null;
}
export function parseWorkflowText(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        return { raw: null };
    }
    const doc = parseDocument(trimmed);
    if (doc.errors && doc.errors.length > 0) {
        return {
            raw: null,
            parseError: doc.errors.map((e) => e.message).join("; "),
        };
    }
    const raw = doc.toJSON();
    if (raw === null || raw === undefined) {
        return { raw: null };
    }
    const map = asMap(raw);
    if (!map) {
        return {
            raw: null,
            parseError: "Workflow root must be a YAML mapping",
        };
    }
    return { raw: map };
}
function formatRunsOn(runsOn) {
    if (runsOn === undefined || runsOn === null)
        return undefined;
    if (typeof runsOn === "string") {
        const s = runsOn.trim();
        return s === "" ? undefined : s;
    }
    if (Array.isArray(runsOn)) {
        return runsOn.map((x) => String(x)).join(", ");
    }
    // expression or map form — stringify lightly
    try {
        return JSON.stringify(runsOn);
    }
    catch {
        return String(runsOn);
    }
}
export function listJobs(raw) {
    if (!raw)
        return { jobs: [] };
    const workflowName = raw.name !== undefined && raw.name !== null && String(raw.name).trim()
        ? String(raw.name).trim()
        : undefined;
    const jobsMap = asMap(raw.jobs);
    const jobs = [];
    if (!jobsMap) {
        return {
            ...(workflowName ? { name: workflowName } : {}),
            jobs,
        };
    }
    for (const [id, jobVal] of Object.entries(jobsMap)) {
        const job = asMap(jobVal);
        const entry = { id };
        if (job) {
            if (job.name !== undefined && job.name !== null && String(job.name).trim()) {
                entry.name = String(job.name).trim();
            }
            // runs-on (YAML key) may also appear as runs_on if someone used that
            const runsOn = job["runs-on"] ?? job["runs_on"];
            const formatted = formatRunsOn(runsOn);
            if (formatted)
                entry.runsOn = formatted;
            if (Array.isArray(job.steps)) {
                entry.stepsCount = job.steps.length;
            }
        }
        jobs.push(entry);
    }
    return {
        ...(workflowName ? { name: workflowName } : {}),
        jobs,
    };
}
/**
 * Normalize `on:` which may be string | string[] | map into event name list.
 */
export function normalizeTriggers(onVal) {
    if (onVal === undefined || onVal === null) {
        return { on: onVal ?? null, events: [] };
    }
    if (typeof onVal === "string") {
        const s = onVal.trim();
        return { on: onVal, events: s ? [s] : [] };
    }
    if (Array.isArray(onVal)) {
        const events = onVal
            .map((x) => String(x).trim())
            .filter((x) => x.length > 0);
        // de-dupe preserving order
        const seen = new Set();
        const unique = [];
        for (const e of events) {
            if (!seen.has(e)) {
                seen.add(e);
                unique.push(e);
            }
        }
        return { on: onVal, events: unique };
    }
    const map = asMap(onVal);
    if (map) {
        const events = Object.keys(map).filter((k) => k.trim().length > 0);
        return { on: onVal, events };
    }
    return { on: onVal, events: [] };
}
/**
 * Find secrets.NAME / ${{ secrets.NAME }} style refs — names only, never values.
 */
export function findSecretRefs(text) {
    const src = text ?? "";
    const names = new Set();
    // ${{ secrets.NAME }} or ${{secrets.NAME}} with optional spaces / property access
    const exprRe = /\$\{\{\s*secrets\.([A-Za-z_][A-Za-z0-9_]*)\s*(?:\.|\[|\}|\|)/g;
    let m;
    while ((m = exprRe.exec(src)) !== null) {
        names.add(m[1]);
    }
    // Also bare secrets.NAME outside expressions (e.g. in docs/comments or env maps as text)
    // Avoid matching "secrets." that is already captured; still useful for env: FOO: ${{ secrets.FOO }}
    const bareRe = /(?:^|[^A-Za-z0-9_])secrets\.([A-Za-z_][A-Za-z0-9_]*)/g;
    while ((m = bareRe.exec(src)) !== null) {
        names.add(m[1]);
    }
    return [...names].sort((a, b) => a.localeCompare(b));
}
function walkSteps(raw, visit) {
    const jobsMap = asMap(raw.jobs);
    if (!jobsMap)
        return;
    for (const [jobId, jobVal] of Object.entries(jobsMap)) {
        const job = asMap(jobVal);
        if (!job || !Array.isArray(job.steps))
            continue;
        for (const step of job.steps) {
            const sm = asMap(step);
            if (sm)
                visit(sm, jobId);
        }
    }
}
function actionRef(uses) {
    // owner/repo@ref or docker:// or ./path
    const at = uses.lastIndexOf("@");
    if (at <= 0)
        return null;
    if (uses.startsWith("docker://") || uses.startsWith("./") || uses.startsWith(".")) {
        return null;
    }
    return { repo: uses.slice(0, at), ref: uses.slice(at + 1) };
}
function looksLikeSha(ref) {
    return /^[0-9a-f]{40}$/i.test(ref) || /^[0-9a-f]{64}$/i.test(ref);
}
/**
 * Educational heuristic lint — not an exploit guide.
 */
export function lintWorkflow(text, raw, parseError) {
    const findings = [];
    if (parseError) {
        findings.push({
            severity: "error",
            rule: "yaml_parse_error",
            advice: `YAML parse failed: ${parseError}`,
        });
        return findings;
    }
    if (!raw) {
        findings.push({
            severity: "warn",
            rule: "empty_workflow",
            advice: "No workflow mapping found. Provide a GitHub Actions workflow YAML string.",
        });
        return findings;
    }
    // Normalize triggers
    const { events } = normalizeTriggers(raw.on);
    const hasPrTarget = events.includes("pull_request_target");
    // pull_request_target + checkout of PR ref is a known high-risk pattern (educational note)
    if (hasPrTarget) {
        let checkoutOfPrRef = false;
        walkSteps(raw, (step) => {
            const uses = step.uses !== undefined ? String(step.uses) : "";
            if (!/actions\/checkout@/i.test(uses))
                return;
            const withMap = asMap(step.with);
            if (!withMap)
                return;
            const ref = withMap.ref !== undefined ? String(withMap.ref) : "";
            // Common PR head refs / expressions
            if (/pull_request/i.test(ref) ||
                /github\.event\.pull_request/i.test(ref) ||
                /heads\//i.test(ref)) {
                checkoutOfPrRef = true;
            }
        });
        findings.push({
            severity: checkoutOfPrRef ? "warn" : "info",
            rule: "pull_request_target",
            advice: checkoutOfPrRef
                ? "Workflow uses pull_request_target and appears to check out a PR ref. Prefer pull_request for untrusted code, keep secrets out of that job, and pin trusted actions. Educational note only."
                : "Workflow listens to pull_request_target. Review checkout/ref usage and secret access carefully — this event runs in the base repo context. Educational note only.",
        });
    }
    // Missing top-level permissions (optional / informational)
    if (raw.permissions === undefined) {
        findings.push({
            severity: "info",
            rule: "missing_permissions",
            advice: "No top-level `permissions:` block. Consider declaring least-privilege permissions explicitly (optional hardening).",
        });
    }
    // curl | bash smells in run scripts
    const curlBashRe = /curl\b[^|\n]*\|\s*(?:sudo\s+)?(?:ba)?sh\b|wget\b[^|\n]*\|\s*(?:sudo\s+)?(?:ba)?sh\b/i;
    walkSteps(raw, (step, jobId) => {
        const run = step.run !== undefined ? String(step.run) : "";
        if (run && curlBashRe.test(run)) {
            findings.push({
                severity: "warn",
                rule: "curl_pipe_shell",
                advice: `Job "${jobId}" has a run step that pipes curl/wget into a shell. Prefer downloading, verifying checksums/signatures, then executing pinned artifacts.`,
            });
        }
    });
    // Also scan full text for the smell (covers multi-line YAML block scalars already via parse, but catch string form)
    if (curlBashRe.test(text) && !findings.some((f) => f.rule === "curl_pipe_shell")) {
        findings.push({
            severity: "warn",
            rule: "curl_pipe_shell",
            advice: "Workflow text contains curl/wget piped to a shell. Prefer verify-then-run patterns with pinned artifacts.",
        });
    }
    // actions@master / unpinned mutable tags (no SHA)
    const seenUses = new Set();
    walkSteps(raw, (step, jobId) => {
        if (step.uses === undefined || step.uses === null)
            return;
        const uses = String(step.uses).trim();
        if (!uses || uses.startsWith("docker://") || uses.startsWith("./"))
            return;
        const parsed = actionRef(uses);
        if (!parsed)
            return;
        const key = `${jobId}:${uses}`;
        if (seenUses.has(key))
            return;
        seenUses.add(key);
        const { ref } = parsed;
        if (ref === "master" || ref === "main") {
            findings.push({
                severity: "warn",
                rule: "action_mutable_branch",
                advice: `Job "${jobId}" uses \`${uses}\` on a mutable branch (@${ref}). Prefer a version tag or full commit SHA pin.`,
            });
        }
        else if (!looksLikeSha(ref) && !/^v?\d+(\.\d+)*$/.test(ref)) {
            // floating tags like "latest" or odd refs
            if (ref === "latest" || ref === "head") {
                findings.push({
                    severity: "warn",
                    rule: "action_unpinned",
                    advice: `Job "${jobId}" uses \`${uses}\` with mutable ref @${ref}. Prefer a full commit SHA.`,
                });
            }
        }
        else if (!looksLikeSha(ref)) {
            // version tag like v4 — info that SHA pin is stronger
            findings.push({
                severity: "info",
                rule: "action_tag_not_sha",
                advice: `Job "${jobId}" uses \`${uses}\` with a version tag. Consider pinning to a full commit SHA for stronger supply-chain guarantees.`,
            });
        }
    });
    // No jobs
    if (!asMap(raw.jobs) || Object.keys(asMap(raw.jobs) ?? {}).length === 0) {
        findings.push({
            severity: "warn",
            rule: "no_jobs",
            advice: "Workflow has no `jobs:` entries.",
        });
    }
    // No on:
    if (raw.on === undefined) {
        findings.push({
            severity: "warn",
            rule: "missing_on",
            advice: "Workflow is missing `on:` triggers.",
        });
    }
    return findings;
}
