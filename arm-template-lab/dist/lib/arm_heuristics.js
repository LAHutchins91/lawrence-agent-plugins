/**
 * Shared Azure ARM template JSON text helpers.
 * Pure JSON string heuristics — no az CLI, deploy, network, filesystem follow, or eval.
 */
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
/** Best-effort JSON parse; returns null on empty/invalid. */
export function parseJsonObject(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return null;
    try {
        return JSON.parse(trimmed);
    }
    catch {
        // Try to salvage if there's trailing noise after a JSON object
        const start = trimmed.indexOf("{");
        const end = trimmed.lastIndexOf("}");
        if (start >= 0 && end > start) {
            try {
                return JSON.parse(trimmed.slice(start, end + 1));
            }
            catch {
                return null;
            }
        }
        return null;
    }
}
function resourceFromEntry(raw) {
    const map = asMap(raw);
    if (!map)
        return null;
    const type = strField(map, "type") ?? strField(map, "Type");
    const name = strField(map, "name") ?? strField(map, "Name");
    const apiVersion = strField(map, "apiVersion") ?? strField(map, "api_version");
    const location = strField(map, "location") ?? strField(map, "Location");
    if (!type && !name && !apiVersion && !location)
        return null;
    const info = {};
    if (type)
        info.type = type;
    if (name)
        info.name = name;
    if (apiVersion)
        info.apiVersion = apiVersion;
    if (location)
        info.location = location;
    return info;
}
/** Extract resources[] entries (type, name, apiVersion, location). */
export function extractResources(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return [];
    const resources = [];
    const seen = new Set();
    const push = (info) => {
        const key = `${info.type ?? ""}|${info.name ?? ""}|${info.apiVersion ?? ""}|${info.location ?? ""}`;
        if (seen.has(key))
            return;
        seen.add(key);
        resources.push(info);
    };
    const doc = parseJsonObject(trimmed);
    const map = asMap(doc);
    if (map) {
        const arr = map.resources ?? map.Resources;
        if (Array.isArray(arr)) {
            for (const entry of arr) {
                const info = resourceFromEntry(entry);
                if (info)
                    push(info);
            }
        }
    }
    // Regex fallback for partial / broken JSON
    if (resources.length === 0) {
        // Match objects that look like ARM resources with "type": "Microsoft...."
        const blockRe = /\{\s*"type"\s*:\s*"([^"]+)"\s*,([\s\S]*?)(?=\}\s*,\s*\{|\}\s*\])/gi;
        let m;
        while ((m = blockRe.exec(trimmed)) !== null) {
            const type = m[1];
            const body = `"type":"${type}",${m[2]}`;
            const nameM = body.match(/"name"\s*:\s*"((?:\\.|[^"\\])*)"/i);
            const apiM = body.match(/"apiVersion"\s*:\s*"((?:\\.|[^"\\])*)"/i);
            const locM = body.match(/"location"\s*:\s*"((?:\\.|[^"\\])*)"/i);
            const info = { type };
            if (nameM)
                info.name = nameM[1];
            if (apiM)
                info.apiVersion = apiM[1];
            if (locM)
                info.location = locM[1];
            push(info);
        }
        // Also try looser type+name pairs
        if (resources.length === 0) {
            const looseRe = /"type"\s*:\s*"(Microsoft\.[^"]+)"[\s\S]{0,400}?"name"\s*:\s*"((?:\\.|[^"\\])*)"/gi;
            let lm;
            while ((lm = looseRe.exec(trimmed)) !== null) {
                const window = trimmed.slice(lm.index, lm.index + 600);
                const apiM = window.match(/"apiVersion"\s*:\s*"((?:\\.|[^"\\])*)"/i);
                const locM = window.match(/"location"\s*:\s*"((?:\\.|[^"\\])*)"/i);
                const info = { type: lm[1], name: lm[2] };
                if (apiM)
                    info.apiVersion = apiM[1];
                if (locM)
                    info.location = locM[1];
                push(info);
            }
        }
    }
    return resources;
}
/** Extract parameters (name, type, hasDefault, secure). */
export function extractParameters(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return [];
    const parameters = [];
    const seen = new Set();
    const push = (info) => {
        if (seen.has(info.name))
            return;
        seen.add(info.name);
        parameters.push(info);
    };
    const doc = parseJsonObject(trimmed);
    const map = asMap(doc);
    if (map) {
        const params = asMap(map.parameters) ?? asMap(map.Parameters);
        if (params) {
            for (const [name, raw] of Object.entries(params)) {
                const p = asMap(raw) ?? {};
                const type = strField(p, "type") ?? strField(p, "Type");
                const hasDefault = Object.prototype.hasOwnProperty.call(p, "defaultValue") ||
                    Object.prototype.hasOwnProperty.call(p, "DefaultValue");
                const secure = typeof type === "string" &&
                    /^(secureString|secureObject)$/i.test(type);
                const info = { name };
                if (type)
                    info.type = type;
                info.hasDefault = hasDefault;
                info.secure = secure;
                push(info);
            }
        }
    }
    // Regex fallback
    if (parameters.length === 0) {
        const paramsBlock = trimmed.match(/"parameters"\s*:\s*\{([\s\S]*?)\}(?:\s*,\s*"(?:variables|resources|outputs|functions)"|\s*\}\s*$)/i);
        const body = paramsBlock ? paramsBlock[1] : trimmed;
        const nameRe = /"([A-Za-z_][\w]*)"\s*:\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;
        let m;
        while ((m = nameRe.exec(body)) !== null) {
            const name = m[1];
            if (/^(type|defaultValue|metadata|allowedValues|minValue|maxValue|minLength|maxLength)$/i.test(name)) {
                continue;
            }
            const inner = m[2];
            const typeM = inner.match(/"type"\s*:\s*"([^"]+)"/i);
            const hasDefault = /"defaultValue"\s*:/i.test(inner);
            const type = typeM ? typeM[1] : undefined;
            const secure = typeof type === "string" &&
                /^(secureString|secureObject)$/i.test(type);
            const info = { name };
            if (type)
                info.type = type;
            info.hasDefault = hasDefault;
            info.secure = secure;
            push(info);
        }
    }
    return parameters;
}
/** Extract outputs (name, type). */
export function extractOutputs(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed)
        return [];
    const outputs = [];
    const seen = new Set();
    const push = (info) => {
        if (seen.has(info.name))
            return;
        seen.add(info.name);
        outputs.push(info);
    };
    const doc = parseJsonObject(trimmed);
    const map = asMap(doc);
    if (map) {
        const outs = asMap(map.outputs) ?? asMap(map.Outputs);
        if (outs) {
            for (const [name, raw] of Object.entries(outs)) {
                const o = asMap(raw) ?? {};
                const type = strField(o, "type") ?? strField(o, "Type");
                const info = { name };
                if (type)
                    info.type = type;
                push(info);
            }
        }
    }
    // Regex fallback
    if (outputs.length === 0) {
        const outsBlock = trimmed.match(/"outputs"\s*:\s*\{([\s\S]*)\}\s*$/i);
        const body = outsBlock ? outsBlock[1] : trimmed;
        const nameRe = /"([A-Za-z_][\w]*)"\s*:\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;
        let m;
        while ((m = nameRe.exec(body)) !== null) {
            const name = m[1];
            if (/^(type|value|condition|metadata|copy)$/i.test(name))
                continue;
            const inner = m[2];
            if (!/"type"\s*:/i.test(inner) && !/"value"\s*:/i.test(inner))
                continue;
            const typeM = inner.match(/"type"\s*:\s*"([^"]+)"/i);
            const info = { name };
            if (typeM)
                info.type = typeM[1];
            push(info);
        }
    }
    return outputs;
}
function looksLikeArm(text) {
    return (/\$schema/i.test(text) ||
        /contentVersion/i.test(text) ||
        /"resources"\s*:/i.test(text) ||
        /"parameters"\s*:/i.test(text) ||
        /"outputs"\s*:/i.test(text) ||
        /"variables"\s*:/i.test(text) ||
        /Microsoft\.[A-Za-z]+\//.test(text) ||
        /schema\.management\.azure\.com/i.test(text) ||
        // light Bicep-ish
        /\bparam\s+\w+\s+(string|int|bool|object|array|secureString)\b/i.test(text) ||
        /\bresource\s+\w+\s+['"]Microsoft\./i.test(text) ||
        /\boutput\s+\w+\s+(string|int|bool|object|array)\b/i.test(text));
}
function hasSchema(text) {
    return (/"\$schema"\s*:\s*"/i.test(text) ||
        /\$schema\s*[:=]/i.test(text) ||
        /schema\.management\.azure\.com/i.test(text));
}
function hasContentVersion(text) {
    return /"contentVersion"\s*:\s*"/i.test(text);
}
function hasPlaintextSecretsInVariables(text) {
    // variables block with password/secret/api_key/token-ish keys and literal string values
    const varsBlock = text.match(/"variables"\s*:\s*\{([\s\S]*?)\}(?:\s*,\s*"(?:resources|outputs|functions|parameters)"|\s*\}\s*$)/i);
    const body = varsBlock ? varsBlock[1] : "";
    const search = body || text;
    if (/"(?:password|secret|api[_-]?key|access[_-]?key|token|private[_-]?key|connection[_-]?string)"\s*:\s*"[^"\[\]]{4,}"/i.test(search)) {
        return true;
    }
    // Also catch bare literals that look like secrets assigned in variables
    if (/"variables"\s*:[\s\S]{0,2000}"(?:PASSWORD|SECRET|API_KEY|TOKEN)"\s*:\s*"[A-Za-z0-9/+=._-]{8,}"/i.test(text)) {
        return true;
    }
    return false;
}
function hasWildcardRoleAssignmentActions(text) {
    // roleAssignments / roleDefinition / actions with "*"
    if (/roleAssignments/i.test(text) &&
        /"actions"\s*:\s*\[[^\]]*"\*"/.test(text)) {
        return true;
    }
    if (/Microsoft\.Authorization\/role(Assignments|Definitions)/i.test(text) &&
        (/"actions"\s*:\s*\[[^\]]*"\*"/i.test(text) ||
            /"notActions"\s*:\s*\[\s*\]/i.test(text) === false &&
                /"actions"\s*:\s*\[\s*"\*"\s*\]/i.test(text))) {
        return true;
    }
    // Generic tip: actions array with wildcard near role*
    if (/"actions"\s*:\s*\[\s*"\*"\s*\]/i.test(text) &&
        /role/i.test(text)) {
        return true;
    }
    return false;
}
function anyResourceMissingApiVersion(text) {
    const resources = extractResources(text);
    if (resources.length > 0) {
        return resources.some((r) => !r.apiVersion);
    }
    // Regex: type Microsoft... without nearby apiVersion
    if (/Microsoft\.[A-Za-z]+\//.test(text) && !/"apiVersion"\s*:/i.test(text)) {
        return true;
    }
    return false;
}
export function lintArm(text) {
    const findings = [];
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Provide non-empty Azure ARM template JSON text. This tool only analyzes the string you pass — it never reads the filesystem.",
        });
        return findings;
    }
    const armish = looksLikeArm(trimmed);
    // Bicep-ish / empty-ish without ARM markers → still allow missing schema tip lightly
    if (!armish) {
        findings.push({
            severity: "warn",
            rule: "empty_source",
            advice: "No clear Azure ARM / Bicep patterns found ($schema, contentVersion, resources, Microsoft.* types). Paste an ARM template JSON string. Educational tip only.",
        });
        return findings;
    }
    if (!hasSchema(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "missing_schema",
            advice: "ARM templates usually include a top-level `$schema` pointing at schema.management.azure.com (e.g. deploymentTemplate.json#). Educational tip only — this tool never runs az.",
        });
    }
    if (!hasContentVersion(trimmed)) {
        // Bicep files won't have contentVersion — only tip if it looks like JSON ARM
        if (/"resources"\s*:/i.test(trimmed) ||
            /"parameters"\s*:/i.test(trimmed) ||
            trimmed.trimStart().startsWith("{")) {
            findings.push({
                severity: "warn",
                rule: "missing_contentVersion",
                advice: "ARM JSON templates usually include `contentVersion` (e.g. \"1.0.0.0\"). Educational tip only.",
            });
        }
    }
    if (hasPlaintextSecretsInVariables(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "plaintext_secret_variables",
            advice: "Possible plaintext secret or credential-like value in `variables` (password/secret/api_key/token…). Prefer `secureString` parameters or Key Vault references — never commit secrets. Educational heuristic only, not an exploit guide.",
        });
    }
    if (hasWildcardRoleAssignmentActions(trimmed)) {
        findings.push({
            severity: "info",
            rule: "wildcard_role_actions_tip",
            advice: "Template text looks like it may grant wildcard `*` actions near roleAssignments / role definitions. Review least-privilege RBAC before deploy. Educational tip only — not an exploit guide.",
        });
    }
    if (anyResourceMissingApiVersion(trimmed)) {
        findings.push({
            severity: "warn",
            rule: "missing_apiVersion",
            advice: "One or more resources appear to lack an `apiVersion`. Pin an explicit API version for each resource. Educational tip only.",
        });
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
