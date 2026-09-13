/**
 * Shared AWS SAM / CloudFormation template.yaml text helpers.
 * Pure YAML string heuristics — no SAM CLI, AWS deploy, network, filesystem follow, or eval.
 */
import { parse, parseAllDocuments } from "yaml";
export function asMap(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value;
    }
    return null;
}
export function strField(map, key) {
    if (!map)
        return undefined;
    const v = map[key];
    if (v === undefined || v === null)
        return undefined;
    if (typeof v === "object") {
        // Intrinsic like !Ref / { Ref: ... } — stringify lightly
        try {
            return JSON.stringify(v);
        }
        catch {
            return undefined;
        }
    }
    const s = String(v).trim();
    return s === "" ? undefined : s;
}
export function numOrStrField(map, key) {
    if (!map)
        return undefined;
    const v = map[key];
    if (v === undefined || v === null)
        return undefined;
    if (typeof v === "number")
        return v;
    if (typeof v === "string") {
        const t = v.trim();
        if (!t)
            return undefined;
        const n = Number(t);
        if (!Number.isNaN(n) && /^-?\d+(\.\d+)?$/.test(t))
            return n;
        return t;
    }
    return undefined;
}
/** Best-effort YAML parse; returns null on empty/invalid. */
export function parseYamlObject(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return null;
    try {
        return parse(trimmed);
    }
    catch {
        return null;
    }
}
export function parseYamlDocs(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return [];
    try {
        const docs = parseAllDocuments(trimmed);
        const out = [];
        for (const doc of docs) {
            if (doc.errors && doc.errors.length > 0)
                continue;
            const raw = doc.toJSON();
            if (raw === null || raw === undefined)
                continue;
            out.push(raw);
        }
        return out;
    }
    catch {
        return [];
    }
}
const FUNCTION_TYPES = new Set([
    "AWS::Serverless::Function",
    "AWS::Lambda::Function",
]);
function isFunctionType(t) {
    return typeof t === "string" && FUNCTION_TYPES.has(t);
}
function propsOf(resource) {
    return asMap(resource.Properties) ?? asMap(resource.properties);
}
function functionFromResource(id, resource) {
    const type = strField(resource, "Type") ?? strField(resource, "type");
    if (!isFunctionType(type))
        return null;
    const props = propsOf(resource) ?? {};
    const info = { id };
    const runtime = strField(props, "Runtime") ?? strField(props, "runtime");
    const handler = strField(props, "Handler") ?? strField(props, "handler");
    const timeout = numOrStrField(props, "Timeout") ?? numOrStrField(props, "timeout");
    const memory = numOrStrField(props, "MemorySize") ??
        numOrStrField(props, "Memory") ??
        numOrStrField(props, "memorySize") ??
        numOrStrField(props, "memory");
    // PackageType Image may omit Runtime/Handler — still list the function
    if (runtime)
        info.runtime = runtime;
    if (handler)
        info.handler = handler;
    if (timeout !== undefined)
        info.timeout = timeout;
    if (memory !== undefined)
        info.memory = memory;
    return info;
}
/** Extract AWS::Serverless::Function / AWS::Lambda::Function entries. */
export function extractFunctions(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return [];
    const functions = [];
    const seen = new Set();
    const push = (info) => {
        const key = info.id ?? JSON.stringify(info);
        if (seen.has(key))
            return;
        seen.add(key);
        functions.push(info);
    };
    const docs = parseYamlDocs(trimmed);
    for (const doc of docs) {
        const map = asMap(doc);
        if (!map)
            continue;
        const resources = asMap(map.Resources) ?? asMap(map.resources) ?? null;
        if (!resources)
            continue;
        for (const [id, raw] of Object.entries(resources)) {
            const res = asMap(raw);
            if (!res)
                continue;
            const info = functionFromResource(id, res);
            if (info)
                push(info);
        }
    }
    // Regex fallback for partial / broken YAML
    if (functions.length === 0) {
        // LogicalId:\n  Type: AWS::Serverless::Function
        const blockRe = /^([A-Za-z][A-Za-z0-9]*)\s*:\s*\n(?:[ \t]+.+\n)*?[ \t]+Type:\s*(AWS::(?:Serverless|Lambda)::Function)\b/gim;
        let m;
        while ((m = blockRe.exec(trimmed)) !== null) {
            const id = m[1];
            // slice a window after the match for props
            const window = trimmed.slice(m.index, m.index + 800);
            const runtimeM = window.match(/\bRuntime:\s*["']?([^\s"'#]+)/i);
            const handlerM = window.match(/\bHandler:\s*["']?([^\s"'#]+)/i);
            const timeoutM = window.match(/\bTimeout:\s*["']?(\d+)/i);
            const memoryM = window.match(/\bMemorySize:\s*["']?(\d+)/i);
            const info = { id };
            if (runtimeM)
                info.runtime = runtimeM[1];
            if (handlerM)
                info.handler = handlerM[1];
            if (timeoutM)
                info.timeout = Number(timeoutM[1]);
            if (memoryM)
                info.memory = Number(memoryM[1]);
            push(info);
        }
    }
    return functions;
}
/** Extract Events attached to Serverless Functions. */
export function extractEvents(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return [];
    const events = [];
    const seen = new Set();
    const push = (info) => {
        const key = `${info.function ?? ""}|${info.type ?? ""}|${JSON.stringify(info.properties ?? {})}`;
        if (seen.has(key))
            return;
        seen.add(key);
        events.push(info);
    };
    const docs = parseYamlDocs(trimmed);
    for (const doc of docs) {
        const map = asMap(doc);
        if (!map)
            continue;
        const resources = asMap(map.Resources) ?? asMap(map.resources) ?? null;
        if (!resources)
            continue;
        for (const [id, raw] of Object.entries(resources)) {
            const res = asMap(raw);
            if (!res)
                continue;
            const type = strField(res, "Type") ?? strField(res, "type");
            if (type !== "AWS::Serverless::Function")
                continue;
            const props = propsOf(res);
            if (!props)
                continue;
            const evMap = asMap(props.Events) ?? asMap(props.events);
            if (!evMap)
                continue;
            for (const [, evRaw] of Object.entries(evMap)) {
                const ev = asMap(evRaw);
                if (!ev)
                    continue;
                const evType = strField(ev, "Type") ?? strField(ev, "type");
                const evProps = asMap(ev.Properties) ?? asMap(ev.properties) ?? undefined;
                const info = { function: id };
                if (evType)
                    info.type = evType;
                if (evProps && Object.keys(evProps).length > 0) {
                    info.properties = evProps;
                }
                if (info.type || info.properties)
                    push(info);
            }
        }
    }
    // Regex fallback: Type: Api / Schedule / etc under Events
    if (events.length === 0) {
        // Find function blocks then Events Type lines — coarse
        const fnBlocks = /([A-Za-z][A-Za-z0-9]*)\s*:\s*\n(?:[ \t]+.+\n)*?[ \t]+Type:\s*AWS::Serverless::Function\b([\s\S]*?)(?=\n[A-Za-z][A-Za-z0-9]*\s*:|\nOutputs:|\nParameters:|\nConditions:|$)/gi;
        let m;
        while ((m = fnBlocks.exec(trimmed)) !== null) {
            const fnId = m[1];
            const body = m[2] ?? "";
            const typeRe = /\bType:\s*(Api|HttpApi|S3|SNS|SQS|Schedule|DynamoDB|Kinesis|AlexaSkill|AlexaSkillKit|CloudWatchEvent|EventBridgeRule|IoTRule|Alb|MSK|MQ|SelfManagedKafka|Cognito)\b/gi;
            let tm;
            while ((tm = typeRe.exec(body)) !== null) {
                push({ function: fnId, type: tm[1] });
            }
        }
    }
    return events;
}
/** Extract Globals, Transform, Description, Parameters keys. */
export function extractGlobalsHint(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        return { count: 0 };
    }
    const result = { count: 0 };
    let hitCount = 0;
    const docs = parseYamlDocs(trimmed);
    let map = null;
    for (const doc of docs) {
        const m = asMap(doc);
        if (!m)
            continue;
        // Prefer docs that look like CFN/SAM templates
        if (m.Transform !== undefined ||
            m.Globals !== undefined ||
            m.Resources !== undefined ||
            m.AWSTemplateFormatVersion !== undefined ||
            m.Parameters !== undefined) {
            map = m;
            break;
        }
        if (!map)
            map = m;
    }
    if (map) {
        if (map.Globals !== undefined || map.globals !== undefined) {
            const g = asMap(map.Globals) ?? asMap(map.globals);
            if (g) {
                result.globals = g;
                hitCount += 1;
            }
        }
        const transform = map.Transform ?? map.transform;
        if (typeof transform === "string" && transform.trim()) {
            result.transform = transform.trim();
            hitCount += 1;
        }
        else if (Array.isArray(transform)) {
            const arr = transform
                .map((x) => (typeof x === "string" ? x.trim() : String(x)))
                .filter(Boolean);
            if (arr.length > 0) {
                result.transform = arr.length === 1 ? arr[0] : arr;
                hitCount += 1;
            }
        }
        const desc = strField(map, "Description") ?? strField(map, "description");
        if (desc) {
            result.description = desc;
            hitCount += 1;
        }
        const params = asMap(map.Parameters) ?? asMap(map.parameters);
        if (params) {
            const keys = Object.keys(params);
            if (keys.length > 0) {
                result.parameters = keys;
                hitCount += keys.length;
            }
        }
    }
    // Regex fallback
    if (hitCount === 0) {
        const transformM = trimmed.match(/^\s*Transform:\s*["']?([^\n#"']+)/im);
        if (transformM) {
            result.transform = transformM[1].trim();
            hitCount += 1;
        }
        const descM = trimmed.match(/^\s*Description:\s*["']?(.+?)["']?\s*$/im);
        if (descM) {
            result.description = descM[1].trim();
            hitCount += 1;
        }
        // Parameters: section keys
        const paramsBlock = trimmed.match(/^\s*Parameters:\s*\n((?:[ \t]+.+\n?)*)/im);
        if (paramsBlock) {
            const keys = [];
            const keyRe = /^[ \t]{2}([A-Za-z][A-Za-z0-9]*)\s*:/gm;
            let km;
            while ((km = keyRe.exec(paramsBlock[1])) !== null) {
                keys.push(km[1]);
            }
            if (keys.length > 0) {
                result.parameters = keys;
                hitCount += keys.length;
            }
        }
        if (/^\s*Globals:\s*$/im.test(trimmed) || /^\s*Globals:\s*\n/im.test(trimmed)) {
            // Try to parse Globals subsection alone
            const gBlock = trimmed.match(/^\s*Globals:\s*\n((?:[ \t]+.+\n?)*)/im);
            if (gBlock) {
                try {
                    const parsed = parse(`Globals:\n${gBlock[1]}`);
                    const gm = asMap(parsed);
                    const g = gm ? asMap(gm.Globals) : null;
                    if (g) {
                        result.globals = g;
                        hitCount += 1;
                    }
                }
                catch {
                    // ignore
                }
            }
        }
    }
    result.count = hitCount;
    // Drop empty optional fields for cleaner JSON
    if (result.globals && Object.keys(result.globals).length === 0) {
        delete result.globals;
    }
    return result;
}
function hasLatestImage(text) {
    if (/:latest\b/i.test(text))
        return true;
    if (/\bImageUri\s*:\s*["']?[^"'#\n]*:latest\b/i.test(text) ||
        /\bImageConfig\b[\s\S]{0,200}:latest\b/i.test(text)) {
        return true;
    }
    return false;
}
function hasPlaintextSecretInEnv(text) {
    // Environment Variables with password/secret/api_key/token-ish keys and literal values
    if (/\b(?:PASSWORD|SECRET|API[_-]?KEY|ACCESS[_-]?KEY|TOKEN|PRIVATE[_-]?KEY)\b\s*:\s*["']?[^\s"'#{}!]{4,}/i.test(text)) {
        return true;
    }
    // Env under Variables: with suspicious keys
    if (/\bVariables\s*:\s*\n(?:[ \t]+.+\n)*?[ \t]+(?:PASSWORD|SECRET|API[_-]?KEY|TOKEN)\s*:\s*["']?[A-Za-z0-9/+=._-]{6,}/i.test(text)) {
        return true;
    }
    if (/\bAKIA[0-9A-Z]{16}\b/.test(text))
        return true;
    return false;
}
function hasPublicAccessPolicyTip(text) {
    // Policies: or AWS::IAM with public-ish principals / Action *
    if (/\bPrincipal\s*:\s*["']?\*\s*$/im.test(text) ||
        /\bPrincipal\s*:\s*\n(?:[ \t]+.+\n)*?[ \t]+(?:AWS|Service)\s*:\s*["']?\*/im.test(text)) {
        return true;
    }
    if (/\bEffect\s*:\s*Allow\b[\s\S]{0,200}\bAction\s*:\s*["']?\*/i.test(text)) {
        return true;
    }
    if (/\bPolicies\s*:\s*\n(?:[ \t]+.+\n)*?[ \t]+-\s*AdministratorAccess\b/i.test(text)) {
        return true;
    }
    // SAM Auth / Api Access with public open
    if (/\bAuth\s*:\s*\n(?:[ \t]+.+\n)*?[ \t]+DefaultAuthorizer\s*:\s*NONE\b/i.test(text)) {
        return true;
    }
    return false;
}
function hasServerlessTransform(text) {
    return /AWS::Serverless-2016-10-31/.test(text);
}
function looksLikeSamOrCfn(text) {
    return (/\bAWSTemplateFormatVersion\b/.test(text) ||
        /\bTransform\b/.test(text) ||
        /\bAWS::Serverless::/.test(text) ||
        /\bAWS::Lambda::Function\b/.test(text) ||
        /\bResources\s*:/.test(text) ||
        /\bGlobals\s*:/.test(text));
}
function globalsFunctionRuntime(text) {
    const hint = extractGlobalsHint(text);
    const g = hint.globals ? asMap(hint.globals) : null;
    if (!g)
        return undefined;
    const fn = asMap(g.Function) ?? asMap(g.function);
    return strField(fn, "Runtime") ?? strField(fn, "runtime");
}
function anyFunctionMissingRuntime(text) {
    const globalRuntime = globalsFunctionRuntime(text);
    if (globalRuntime)
        return false;
    const fns = extractFunctions(text);
    if (fns.length === 0) {
        // Also check regex for Type Function without Runtime nearby
        if (/Type:\s*AWS::(?:Serverless|Lambda)::Function\b/i.test(text) &&
            !/\bRuntime\s*:/.test(text) &&
            !/\bPackageType\s*:\s*Image\b/i.test(text)) {
            return true;
        }
        return false;
    }
    return fns.some((f) => !f.runtime);
}
export function lintSam(text) {
    const findings = [];
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Provide non-empty AWS SAM / CloudFormation template YAML text. This tool only analyzes the string you pass — it never reads the filesystem.",
        });
        return findings;
    }
    if (looksLikeSamOrCfn(trimmed) || /\bFunction\b/.test(trimmed)) {
        if (/\bAWS::Serverless::/.test(trimmed) ||
            /\bGlobals\s*:/.test(trimmed) ||
            /\bEvents\s*:/.test(trimmed)) {
            if (!hasServerlessTransform(trimmed)) {
                findings.push({
                    severity: "warn",
                    rule: "missing_transform",
                    advice: "SAM resources usually need `Transform: AWS::Serverless-2016-10-31` at the template root. Without it, CloudFormation will not expand AWS::Serverless::* types. Educational tip only.",
                });
            }
        }
        else if (!hasServerlessTransform(trimmed) &&
            /\bTransform\s*:/.test(trimmed) === false &&
            /\bAWS::Lambda::Function\b/.test(trimmed) === false &&
            /\bResources\s*:/.test(trimmed)) {
            // generic CFN without transform — only tip if Serverless-ish keywords appear
        }
    }
    // Missing transform when Globals present even without Serverless:: yet
    if (/^\s*Globals\s*:/m.test(trimmed) &&
        !hasServerlessTransform(trimmed)) {
        if (!findings.some((f) => f.rule === "missing_transform")) {
            findings.push({
                severity: "warn",
                rule: "missing_transform",
                advice: "SAM `Globals` require `Transform: AWS::Serverless-2016-10-31`. Educational tip only — this tool never runs the SAM CLI.",
            });
        }
    }
    if (hasLatestImage(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "latest_image",
            advice: "`:latest` image tag detected (e.g. ImageUri). Prefer pinned image digests or versioned tags for reproducible SAM builds/deploys. Educational heuristic only.",
        });
    }
    if (hasPlaintextSecretInEnv(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "plaintext_secret_env",
            advice: "Possible plaintext secret or credential-like value in Environment Variables (or AKIA…). Prefer SSM/Secrets Manager dynamic references or parameters marked NoEcho — never commit secrets. Educational heuristic only, not an exploit guide.",
        });
    }
    if (hasPublicAccessPolicyTip(trimmed)) {
        findings.push({
            severity: "info",
            rule: "public_access_policy_tip",
            advice: "Template text looks like it may grant broad/public access (Principal `*`, Action `*`, AdministratorAccess, or DefaultAuthorizer NONE). Review least-privilege IAM and API auth before deploy. Educational tip only — not an exploit guide.",
        });
    }
    if (anyFunctionMissingRuntime(trimmed)) {
        // Skip if PackageType Image for all — extractFunctions omits runtime for images
        const fns = extractFunctions(trimmed);
        const imageOnly = fns.length > 0 &&
            fns.every((f) => !f.runtime) &&
            /\bPackageType\s*:\s*Image\b/i.test(trimmed);
        if (!imageOnly) {
            findings.push({
                severity: "warn",
                rule: "missing_runtime",
                advice: "One or more Lambda/Serverless functions appear to lack a `Runtime` (and are not clearly PackageType Image). Set an explicit Runtime (e.g. nodejs20.x, python3.12). Educational tip only.",
            });
        }
    }
    const seen = new Set();
    const deduped = [];
    for (const f of findings) {
        const key = `${f.rule}|${f.advice}`;
        if (seen.has(key))
            continue;
        seen.add(key);
        deduped.push(f);
    }
    return deduped;
}
