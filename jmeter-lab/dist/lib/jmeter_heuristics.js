/**
 * Best-effort JMeter JMX / plan XML text heuristics.
 * No JMeter / load-test runtime, no network, no filesystem follow, no DOM parser required.
 */
/** Normalize newlines / BOM; leave XML otherwise intact. */
export function normalize(raw) {
    return (raw ?? "").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
}
function countOccurrences(text, re) {
    let n = 0;
    const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    while (r.exec(text))
        n++;
    return n;
}
/** Extract attribute value from an open-tag attribute list string. */
function attr(attrs, name) {
    const re = new RegExp(String.raw `\b${name}\s*=\s*(?:"([^"]*)"|'([^']*)')`, "i");
    const m = re.exec(attrs);
    if (!m)
        return undefined;
    const v = (m[1] ?? m[2] ?? "").trim();
    return v || undefined;
}
/**
 * Find opening tags like <TagName ...> or <TagName .../> and return tag + attrs + index.
 * Matches known JMeter element tag names (alphanumeric).
 */
function* scanTags(text, tagNames) {
    const alt = tagNames.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
    const re = new RegExp(String.raw `<(${alt})\b([^>]*?)(/?)\s*>`, "gi");
    let m;
    while ((m = re.exec(text))) {
        yield {
            tag: m[1],
            attrs: m[2] ?? "",
            index: m.index,
            selfClosing: (m[3] ?? "") === "/" || /\/>\s*$/.test(m[0]),
        };
    }
}
/** Slice element body between open tag end and matching close, best-effort (non-nested same tag). */
function elementBody(text, openEnd, tag) {
    const closeRe = new RegExp(String.raw `</${tag}\s*>`, "i");
    const slice = text.slice(openEnd);
    const m = closeRe.exec(slice);
    if (!m)
        return slice.slice(0, 4000);
    return slice.slice(0, m.index);
}
function propValue(body, propName) {
    // <stringProp name="ThreadGroup.num_threads">10</stringProp>
    // <boolProp name="...">true</boolProp>
    // <intProp name="...">1</intProp>
    const re = new RegExp(String.raw `<(?:string|bool|int|long|double|float)Prop\b[^>]*\bname\s*=\s*["']${propName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*>([^<]*)</(?:string|bool|int|long|double|float)Prop>`, "i");
    const m = re.exec(body);
    if (!m)
        return undefined;
    const v = (m[1] ?? "").trim();
    return v || undefined;
}
/**
 * List TestPlan and ThreadGroup elements from guiclass/testclass tags.
 */
export function listPlans(text) {
    const src = normalize(text ?? "");
    const testPlans = [];
    const threadGroups = [];
    const seen = new Set();
    for (const hit of scanTags(src, ["TestPlan"])) {
        const key = `tp|${hit.index}`;
        if (seen.has(key))
            continue;
        seen.add(key);
        const name = attr(hit.attrs, "testname") ??
            attr(hit.attrs, "name") ??
            undefined;
        const entry = {};
        if (name)
            entry.name = name;
        testPlans.push(entry);
    }
    // Also catch testclass="TestPlan" on alternate wrappers
    const tpClass = /<([A-Za-z][\w.]*)\b([^>]*\b(?:testclass|guiclass)\s*=\s*["']TestPlan(?:Gui)?["'][^>]*)>/gi;
    let m;
    while ((m = tpClass.exec(src))) {
        const tag = m[1];
        if (/^TestPlan$/i.test(tag))
            continue; // already counted
        const key = `tp2|${m.index}`;
        if (seen.has(key))
            continue;
        seen.add(key);
        const name = attr(m[2] ?? "", "testname") ?? attr(m[2] ?? "", "name");
        const entry = {};
        if (name)
            entry.name = name;
        testPlans.push(entry);
    }
    for (const hit of scanTags(src, [
        "ThreadGroup",
        "SetupThreadGroup",
        "PostThreadGroup",
        "kg.apc.jmeter.threads.SteppingThreadGroup",
        "com.blazemeter.jmeter.threads.concurrency.ConcurrencyThreadGroup",
        "com.blazemeter.jmeter.threads.arrivals.ArrivalsThreadGroup",
    ])) {
        const key = `tg|${hit.index}`;
        if (seen.has(key))
            continue;
        seen.add(key);
        const openEnd = hit.index + hit.tag.length + hit.attrs.length + 2; // rough; refine below
        // Re-find exact open end
        const openMatch = src.slice(hit.index).match(new RegExp(String.raw `^<${hit.tag}\b[^>]*>`, "i"));
        const bodyStart = hit.index + (openMatch ? openMatch[0].length : 0);
        const body = elementBody(src, bodyStart, hit.tag.split(".").pop() || hit.tag);
        const name = attr(hit.attrs, "testname") ?? attr(hit.attrs, "name") ?? undefined;
        const numThreads = propValue(body, "ThreadGroup.num_threads") ??
            propValue(body, "ThreadGroup.numThreads") ??
            undefined;
        const rampTime = propValue(body, "ThreadGroup.ramp_time") ??
            propValue(body, "ThreadGroup.rampTime") ??
            undefined;
        const entry = {};
        if (name)
            entry.name = name;
        if (numThreads)
            entry.numThreads = numThreads;
        if (rampTime)
            entry.rampTime = rampTime;
        threadGroups.push(entry);
    }
    // testclass="ThreadGroup" on elements we might have missed
    const tgClass = /<([A-Za-z][\w.]*)\b([^>]*\btestclass\s*=\s*["'](?:Setup|Post)?ThreadGroup["'][^>]*)>/gi;
    while ((m = tgClass.exec(src))) {
        const tag = m[1];
        if (/ThreadGroup$/i.test(tag) && !tag.includes(".")) {
            // already handled by scanTags for plain ThreadGroup / Setup / Post
            if (/^(ThreadGroup|SetupThreadGroup|PostThreadGroup)$/i.test(tag))
                continue;
        }
        const key = `tg2|${m.index}`;
        if (seen.has(key))
            continue;
        seen.add(key);
        const attrs = m[2] ?? "";
        const name = attr(attrs, "testname") ?? attr(attrs, "name");
        const openMatch = src.slice(m.index).match(/^<[^>]+>/);
        const bodyStart = m.index + (openMatch ? openMatch[0].length : 0);
        const shortTag = tag.includes(".") ? tag.split(".").pop() : tag;
        const body = elementBody(src, bodyStart, shortTag);
        const numThreads = propValue(body, "ThreadGroup.num_threads");
        const rampTime = propValue(body, "ThreadGroup.ramp_time");
        const entry = {};
        if (name)
            entry.name = name;
        if (numThreads)
            entry.numThreads = numThreads;
        if (rampTime)
            entry.rampTime = rampTime;
        threadGroups.push(entry);
    }
    return {
        testPlans,
        threadGroups,
        count: testPlans.length + threadGroups.length,
    };
}
const KNOWN_SAMPLERS = [
    "HTTPSamplerProxy",
    "HTTPSampler",
    "JavaSampler",
    "JSR223Sampler",
    "BeanShellSampler",
    "DebugSampler",
    "FTPSampler",
    "TCPSampler",
    "JDBCSampler",
    "JMSSampler",
    "JUnitSampler",
    "LDAPSampler",
    "MailReaderSampler",
    "SmtpSampler",
    "AccessLogSampler",
    "AjpSampler",
    "GraphQLHTTPSampler",
];
/**
 * List samplers (HTTPSamplerProxy, JavaSampler, ...) with optional path.
 */
export function listSamplers(text) {
    const src = normalize(text ?? "");
    const samplers = [];
    const seen = new Set();
    const push = (type, index, name, path) => {
        const key = `${type}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        const entry = { type };
        if (name)
            entry.name = name;
        if (path)
            entry.path = path;
        samplers.push(entry);
    };
    for (const type of KNOWN_SAMPLERS) {
        for (const hit of scanTags(src, [type])) {
            const name = attr(hit.attrs, "testname") ?? attr(hit.attrs, "name") ?? undefined;
            const openMatch = src
                .slice(hit.index)
                .match(new RegExp(String.raw `^<${type}\b[^>]*>`, "i"));
            const bodyStart = hit.index + (openMatch ? openMatch[0].length : 0);
            const body = elementBody(src, bodyStart, type);
            const path = propValue(body, "HTTPSampler.path") ??
                propValue(body, "HTTPSampler.Path") ??
                propValue(body, "path") ??
                undefined;
            push(type, hit.index, name, path);
        }
    }
    // testclass="HTTPSamplerProxy" etc. on unknown wrapper tags
    const classRe = /<([A-Za-z][\w.]*)\b([^>]*\btestclass\s*=\s*["']([A-Za-z][\w.]*)["'][^>]*)>/gi;
    let m;
    while ((m = classRe.exec(src))) {
        const tag = m[1];
        const testclass = m[3];
        if (!/Sampler/i.test(testclass) && !KNOWN_SAMPLERS.includes(testclass)) {
            continue;
        }
        if (KNOWN_SAMPLERS.some((k) => k.toLowerCase() === tag.toLowerCase())) {
            continue; // already counted
        }
        const attrs = m[2] ?? "";
        const name = attr(attrs, "testname") ?? attr(attrs, "name");
        const openMatch = src.slice(m.index).match(/^<[^>]+>/);
        const bodyStart = m.index + (openMatch ? openMatch[0].length : 0);
        const shortTag = tag.includes(".") ? tag.split(".").pop() : tag;
        const body = elementBody(src, bodyStart, shortTag);
        const path = propValue(body, "HTTPSampler.path") ??
            propValue(body, "HTTPSampler.Path") ??
            undefined;
        push(testclass, m.index, name, path);
    }
    return { samplers, count: samplers.length };
}
const KNOWN_ASSERTIONS = [
    "ResponseAssertion",
    "DurationAssertion",
    "JSONPathAssertion",
    "JSONAssertion",
    "SizeAssertion",
    "XMLAssertion",
    "XMLSchemaAssertion",
    "XPathAssertion",
    "XPath2Assertion",
    "JSR223Assertion",
    "BeanShellAssertion",
    "MD5HexAssertion",
    "HTMLAssertion",
    "SMIMEAssertion",
    "CompareAssertion",
];
/**
 * List assertion elements.
 */
export function listAssertions(text) {
    const src = normalize(text ?? "");
    const assertions = [];
    const seen = new Set();
    const push = (type, index, name) => {
        const key = `${type}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        const entry = { type };
        if (name)
            entry.name = name;
        assertions.push(entry);
    };
    for (const type of KNOWN_ASSERTIONS) {
        for (const hit of scanTags(src, [type])) {
            const name = attr(hit.attrs, "testname") ?? attr(hit.attrs, "name") ?? undefined;
            push(type, hit.index, name);
        }
    }
    const classRe = /<([A-Za-z][\w.]*)\b([^>]*\btestclass\s*=\s*["']([A-Za-z][\w.]*)["'][^>]*)>/gi;
    let m;
    while ((m = classRe.exec(src))) {
        const tag = m[1];
        const testclass = m[3];
        if (!/Assertion/i.test(testclass))
            continue;
        if (KNOWN_ASSERTIONS.some((k) => k.toLowerCase() === tag.toLowerCase())) {
            continue;
        }
        const name = attr(m[2] ?? "", "testname") ?? attr(m[2] ?? "", "name") ?? undefined;
        push(testclass, m.index, name);
    }
    return { assertions, count: assertions.length };
}
function hasJmeterSignal(src) {
    return (/<jmeterTestPlan\b/i.test(src) ||
        /\btestclass\s*=\s*["']TestPlan["']/i.test(src) ||
        /<TestPlan\b/i.test(src) ||
        /<ThreadGroup\b/i.test(src) ||
        /\btestclass\s*=\s*["']ThreadGroup["']/i.test(src) ||
        /<HTTPSamplerProxy\b/i.test(src) ||
        /guiclass\s*=\s*["'][^"']*Gui["']/i.test(src) ||
        listPlans(src).count > 0 ||
        listSamplers(src).count > 0);
}
export function lintJmeter(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste JMeter JMX / plan XML (e.g. <TestPlan>, <ThreadGroup>, <HTTPSamplerProxy>, <ResponseAssertion>).",
        });
        return findings;
    }
    const src = normalize(raw);
    const { testPlans, threadGroups } = listPlans(src);
    const { samplers } = listSamplers(src);
    const { assertions } = listAssertions(src);
    if (!hasJmeterSignal(src)) {
        findings.push({
            severity: "warn",
            rule: "no_jmeter_detected",
            advice: "No JMeter JMX signals detected (`jmeterTestPlan`, `TestPlan`, `ThreadGroup`, `HTTPSamplerProxy`, or guiclass/testclass). Confirm this is JMeter plan XML.",
        });
    }
    // missing ThreadGroup tip
    if ((testPlans.length > 0 || /<jmeterTestPlan\b/i.test(src)) &&
        threadGroups.length === 0) {
        findings.push({
            severity: "warn",
            rule: "missing_threadgroup_tip",
            advice: "TestPlan / jmeterTestPlan present without a `ThreadGroup` (or Setup/PostThreadGroup) in this text. Add a ThreadGroup so users / ramp can run.",
        });
    }
    // no assertions tip when samplers/threadgroups exist
    if ((samplers.length > 0 || threadGroups.length > 0) &&
        assertions.length === 0) {
        findings.push({
            severity: "info",
            rule: "no_assertions_tip",
            advice: "Samplers / ThreadGroups without ResponseAssertion / DurationAssertion / JSONPathAssertion (etc.) in this text. Add assertions so pass/fail is explicit.",
        });
    }
    // hardcoded credentials tip
    const credPatterns = [
        /<(?:string|arg)Prop\b[^>]*\bname\s*=\s*["'][^"']*(?:password|passwd|pwd|secret|api[_-]?key|token|Authorization)[^"']*["'][^>]*>[^<]{3,}<\/(?:string|arg)Prop>/gi,
        /\b(?:password|passwd|pwd|secret|api[_-]?key|token)\s*[=:]\s*["'][^"']{3,}["']/gi,
        /<stringProp\b[^>]*\bname\s*=\s*["'][^"']*[Uu]sername["'][^>]*>[^<]+<\/stringProp>[\s\S]{0,200}<stringProp\b[^>]*\bname\s*=\s*["'][^"']*[Pp]ass(?:word)?["'][^>]*>[^<]{2,}<\/stringProp>/g,
        /\bBearer\s+[A-Za-z0-9\-._~+/]+=*/,
        /<(?:HeaderManager|AuthManager)\b[^>]*>[\s\S]{0,800}?(?:password|Authorization|Bearer)/gi,
    ];
    let credHits = 0;
    for (const re of credPatterns) {
        credHits += countOccurrences(src, re);
    }
    // AuthManager username/password props
    if (/<AuthManager\b/i.test(src) &&
        /name\s*=\s*["'][^"']*[Pp]ass(?:word)?["']/i.test(src)) {
        credHits += 1;
    }
    if (credHits >= 1) {
        findings.push({
            severity: "warn",
            rule: "hardcoded_credentials_tip",
            advice: `Found ${credHits}× likely hardcoded credential / auth pattern(s). Prefer JMeter user-defined variables, CSV Data Set, or env-injected properties so secrets stay out of the JMX.`,
        });
    }
    // infinite loop tip: continue_forever true or loops -1
    const forever = countOccurrences(src, /<(?:boolProp)\b[^>]*\bname\s*=\s*["']LoopController\.continue_forever["'][^>]*>\s*true\s*<\/boolProp>/gi) +
        countOccurrences(src, /<(?:string|int)Prop\b[^>]*\bname\s*=\s*["']LoopController\.loops["'][^>]*>\s*-1\s*<\/(?:string|int)Prop>/gi);
    if (forever >= 1) {
        findings.push({
            severity: "warn",
            rule: "infinite_loop_tip",
            advice: `Found ${forever}× infinite-loop signal(s) (\`LoopController.continue_forever=true\` or \`loops=-1\`). Prefer a finite loop count or a scheduler duration so the plan cannot run unbounded.`,
        });
    }
    // zero / empty num_threads tip
    for (const tg of threadGroups) {
        if (tg.numThreads === "0") {
            findings.push({
                severity: "warn",
                rule: "zero_threads_tip",
                advice: `ThreadGroup${tg.name ? ` "${tg.name}"` : ""} has num_threads=0. Increase ThreadGroup.num_threads so virtual users actually run.`,
            });
            break;
        }
    }
    // missing ramp tip when many threads and ramp 0 / missing
    for (const tg of threadGroups) {
        const n = parseInt(tg.numThreads ?? "", 10);
        if (!Number.isNaN(n) && n >= 50) {
            const ramp = tg.rampTime;
            if (ramp === undefined || ramp === "0") {
                findings.push({
                    severity: "info",
                    rule: "missing_ramp_tip",
                    advice: `ThreadGroup${tg.name ? ` "${tg.name}"` : ""} has num_threads=${n} with ramp_time ${ramp === undefined ? "missing" : "0"}. A non-zero ramp often avoids a sudden spike.`,
                });
                break;
            }
        }
    }
    // HTTP samplers without path tip
    const httpNoPath = samplers.filter((s) => (s.type === "HTTPSamplerProxy" || s.type === "HTTPSampler") && !s.path);
    if (httpNoPath.length >= 2 && samplers.length >= 2) {
        findings.push({
            severity: "info",
            rule: "http_path_missing_tip",
            advice: `${httpNoPath.length}× HTTP sampler(s) without HTTPSampler.path in this text. Confirm path / domain are set (or inherited from HTTP Request Defaults).`,
        });
    }
    return findings;
}
