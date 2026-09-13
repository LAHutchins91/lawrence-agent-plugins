/**
 * Best-effort Gatling Scala/Java simulation text heuristics.
 * No Gatling / load-test runtime, no network, no filesystem follow, no eval / no Scala compiler.
 */
/** Strip // and /* * / comments; leave strings roughly intact (Scala/Java). */
export function stripComments(raw) {
    const src = (raw ?? "").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    let out = "";
    let i = 0;
    const n = src.length;
    let inString = false;
    let quote = "";
    let inRaw = false; // Scala/Java """ text blocks
    while (i < n) {
        const ch = src[i];
        const next = i + 1 < n ? src[i + 1] : "";
        const next2 = i + 2 < n ? src[i + 2] : "";
        if (inRaw) {
            out += ch;
            if (ch === '"' && next === '"' && next2 === '"') {
                out += '""';
                inRaw = false;
                i += 3;
                continue;
            }
            i++;
            continue;
        }
        if (inString) {
            out += ch;
            if (ch === "\\" && i + 1 < n) {
                out += src[i + 1];
                i += 2;
                continue;
            }
            if (ch === quote)
                inString = false;
            i++;
            continue;
        }
        if (ch === '"' && next === '"' && next2 === '"') {
            inRaw = true;
            out += '"""';
            i += 3;
            continue;
        }
        if (ch === '"' || ch === "'") {
            inString = true;
            quote = ch;
            out += ch;
            i++;
            continue;
        }
        if (ch === "/" && next === "/") {
            i += 2;
            while (i < n && src[i] !== "\n")
                i++;
            continue;
        }
        if (ch === "/" && next === "*") {
            i += 2;
            while (i + 1 < n && !(src[i] === "*" && src[i + 1] === "/"))
                i++;
            i = Math.min(n, i + 2);
            continue;
        }
        out += ch;
        i++;
    }
    return out;
}
function countOccurrences(text, re) {
    let n = 0;
    const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    while (r.exec(text))
        n++;
    return n;
}
function extractBalancedArgs(text, openParenIndex) {
    // openParenIndex points at '('
    if (text[openParenIndex] !== "(")
        return "";
    let depth = 0;
    let i = openParenIndex;
    const n = text.length;
    let inStr = false;
    let q = "";
    while (i < n) {
        const ch = text[i];
        if (inStr) {
            if (ch === "\\" && i + 1 < n) {
                i += 2;
                continue;
            }
            if (ch === q)
                inStr = false;
            i++;
            continue;
        }
        if (ch === '"' || ch === "'") {
            inStr = true;
            q = ch;
            i++;
            continue;
        }
        if (ch === "(")
            depth++;
        else if (ch === ")") {
            depth--;
            if (depth === 0)
                return text.slice(openParenIndex + 1, i).trim();
        }
        i++;
    }
    return text.slice(openParenIndex + 1).trim();
}
/**
 * List Gatling scenarios from scenario("...") and protocol signals.
 */
export function listScenarios(text) {
    const cleaned = stripComments(text ?? "");
    const scenarios = [];
    const seen = new Set();
    // scenario("Name") / scenario("""Name""") / scenario('Name')
    const scnRe = /\bscenario\s*\(\s*(?:"""([\s\S]*?)"""|"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)')/g;
    let m;
    while ((m = scnRe.exec(cleaned))) {
        const name = (m[1] ?? m[2] ?? m[3] ?? "").replace(/\s+/g, " ").trim();
        if (!name)
            continue;
        const key = `${name}|${m.index}`;
        if (seen.has(key))
            continue;
        seen.add(key);
        scenarios.push({ name });
    }
    // Protocols: http.baseUrl, named *Protocol vals, .protocols(
    const protocols = [];
    const protoSeen = new Set();
    const pushProto = (p) => {
        if (!p || protoSeen.has(p))
            return;
        protoSeen.add(p);
        protocols.push(p);
    };
    if (/\bhttp\s*\.\s*baseUrl\s*\(/.test(cleaned))
        pushProto("http.baseUrl");
    if (/\bhttp\s*\.\s*baseURL\s*\(/.test(cleaned))
        pushProto("http.baseURL");
    if (/\.protocols\s*\(/.test(cleaned))
        pushProto("protocols");
    if (/\bHttpProtocolBuilder\b/.test(cleaned))
        pushProto("HttpProtocolBuilder");
    if (/\bProtocol\b/.test(cleaned) && /\bgatling\b/i.test(cleaned)) {
        pushProto("Protocol");
    }
    // val httpProtocol = http... / lazy val xxxProtocol =
    const namedProto = /\b(?:val|lazy\s+val|var|def)\s+([A-Za-z_][\w]*)\s*(?::\s*[^=]+)?=\s*http\b/g;
    while ((m = namedProto.exec(cleaned))) {
        pushProto(m[1]);
    }
    // bare "protocol" defs near setUp
    if (/\bsetUp\s*\(/.test(cleaned) && /\.protocols\s*\(/.test(cleaned)) {
        pushProto("setUp.protocols");
    }
    const result = {
        scenarios,
        count: scenarios.length,
    };
    if (protocols.length)
        result.protocols = protocols;
    return result;
}
const KNOWN_INJECTS = [
    "atOnceUsers",
    "rampUsers",
    "rampUsersPerSec",
    "constantUsersPerSec",
    "stressPeakUsers",
    "heavisideUsers",
    "incrementUsersPerSec",
    "incrementConcurrentUsers",
    "nothingFor",
    "constantConcurrentUsers",
    "rampConcurrentUsers",
];
/**
 * List injection steps from inject( / OpenInjectionStep patterns.
 */
export function listInjects(text) {
    const cleaned = stripComments(text ?? "");
    const injects = [];
    const seen = new Set();
    const push = (kind, index, args) => {
        const key = `${kind}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        const entry = { kind };
        if (args !== undefined && args !== "")
            entry.args = args;
        injects.push(entry);
    };
    // Known inject step calls: atOnceUsers(10), rampUsers(100), ...
    for (const kind of KNOWN_INJECTS) {
        const re = new RegExp(String.raw `\b${kind}\s*\(`, "g");
        let m;
        while ((m = re.exec(cleaned))) {
            const args = extractBalancedArgs(cleaned, m.index + m[0].length - 1);
            // Truncate long args
            const short = args.length > 80 ? args.slice(0, 77).replace(/\s+$/, "") + "..." : args;
            push(kind, m.index, short || undefined);
        }
    }
    // .inject( ... ) signal — if we found no known steps inside, still note inject
    const injectCall = /\.inject\s*\(/g;
    let m;
    while ((m = injectCall.exec(cleaned))) {
        // Only add generic "inject" if no known kind already recorded nearby
        const nearby = cleaned.slice(m.index, Math.min(cleaned.length, m.index + 400));
        const hasKnown = KNOWN_INJECTS.some((k) => nearby.includes(k));
        if (!hasKnown) {
            const args = extractBalancedArgs(cleaned, m.index + m[0].length - 1);
            const short = args.length > 80 ? args.slice(0, 77).replace(/\s+$/, "") + "..." : args;
            push("inject", m.index, short || undefined);
        }
    }
    // OpenInjectionStep / ClosedInjectionStep type mentions
    if (/\bOpenInjectionStep\b/.test(cleaned)) {
        const idx = cleaned.search(/\bOpenInjectionStep\b/);
        push("OpenInjectionStep", idx);
    }
    if (/\bClosedInjectionStep\b/.test(cleaned)) {
        const idx = cleaned.search(/\bClosedInjectionStep\b/);
        push("ClosedInjectionStep", idx);
    }
    if (/\bInjectionStep\b/.test(cleaned) && !/\bOpenInjectionStep\b/.test(cleaned) && !/\bClosedInjectionStep\b/.test(cleaned)) {
        const idx = cleaned.search(/\bInjectionStep\b/);
        push("InjectionStep", idx);
    }
    return { injects, count: injects.length };
}
/**
 * List assertion signals from assertions( / global.responseTime / details( / forAll.
 */
export function listAssertions(text) {
    const cleaned = stripComments(text ?? "");
    const assertions = [];
    const seen = new Set();
    const push = (kind, index) => {
        const key = `${kind}|${index}`;
        if (seen.has(key))
            return;
        seen.add(key);
        assertions.push({ kind });
    };
    const patterns = [
        { re: /\.assertions\s*\(/g, kind: "assertions" },
        { re: /\bassertions\s*\(/g, kind: "assertions" },
        { re: /\bglobal\s*\.\s*responseTime\b/g, kind: "global.responseTime" },
        { re: /\bglobal\s*\.\s*successfulRequests\b/g, kind: "global.successfulRequests" },
        { re: /\bglobal\s*\.\s*failedRequests\b/g, kind: "global.failedRequests" },
        { re: /\bglobal\s*\.\s*allRequests\b/g, kind: "global.allRequests" },
        { re: /\bglobal\s*\.\s*requestsPerSec\b/g, kind: "global.requestsPerSec" },
        { re: /\bforAll\s*\.\s*responseTime\b/g, kind: "forAll.responseTime" },
        { re: /\bforAll\s*\.\s*failedRequests\b/g, kind: "forAll.failedRequests" },
        { re: /\bforAll\b/g, kind: "forAll" },
        { re: /\bdetails\s*\(/g, kind: "details" },
        { re: /\bAssertion\b/g, kind: "Assertion" },
    ];
    for (const { re, kind } of patterns) {
        const r = new RegExp(re.source, "g");
        let m;
        while ((m = r.exec(cleaned))) {
            // Avoid double-counting bare forAll when forAll.responseTime already matched
            if (kind === "forAll") {
                const after = cleaned.slice(m.index, m.index + 40);
                if (/^forAll\s*\./.test(after))
                    continue;
            }
            // Skip Assertion if it's part of a longer word already handled — Assertion is fine
            if (kind === "assertions") {
                const before = cleaned.slice(Math.max(0, m.index - 1), m.index);
                // .assertions already covered; bare assertions( also fine
                void before;
            }
            push(kind, m.index);
        }
    }
    return { assertions, count: assertions.length };
}
function hasGatlingSignal(cleaned) {
    return (/\bio\.gatling\b/.test(cleaned) ||
        /\bgatling\.core\b/.test(cleaned) ||
        /\bgatling\.http\b/.test(cleaned) ||
        /\bSimulation\b/.test(cleaned) ||
        /\bscenario\s*\(/.test(cleaned) ||
        /\bsetUp\s*\(/.test(cleaned) ||
        /\bhttp\s*\.\s*baseUrl\s*\(/.test(cleaned) ||
        /\batOnceUsers\s*\(/.test(cleaned) ||
        /\brampUsers\s*\(/.test(cleaned) ||
        /\.inject\s*\(/.test(cleaned) ||
        listScenarios(cleaned).count > 0 ||
        listInjects(cleaned).count > 0);
}
export function lintGatling(text) {
    const findings = [];
    const raw = text ?? "";
    if (!raw.trim()) {
        findings.push({
            severity: "error",
            rule: "empty_source",
            advice: "Source text is empty. Paste Gatling Scala/Java simulation source (e.g. scenario(\"...\"), setUp(...).inject(atOnceUsers(...)), http.baseUrl, assertions).",
        });
        return findings;
    }
    const cleaned = stripComments(raw);
    const { scenarios } = listScenarios(cleaned);
    const { injects } = listInjects(cleaned);
    const { assertions } = listAssertions(cleaned);
    if (!hasGatlingSignal(cleaned)) {
        findings.push({
            severity: "warn",
            rule: "no_gatling_detected",
            advice: "No Gatling signals detected (`scenario(`, `setUp(`, `http.baseUrl`, `inject(`, `atOnceUsers`/`rampUsers`, `io.gatling`, or `Simulation`). Confirm this is Gatling simulation source.",
        });
    }
    // missing assertions tip when setUp/scenario present but no assertions
    const hasSetup = /\bsetUp\s*\(/.test(cleaned) ||
        scenarios.length > 0 ||
        injects.length > 0;
    const hasAssert = assertions.length > 0 ||
        /\.assertions\s*\(/.test(cleaned) ||
        /\bglobal\s*\.\s*responseTime\b/.test(cleaned);
    if (hasSetup && !hasAssert) {
        findings.push({
            severity: "info",
            rule: "missing_assertions_tip",
            advice: "Simulation / inject signals without `.assertions(` / `global.responseTime` / `details(` / `forAll` in this text. Add Gatling assertions so pass/fail is explicit (e.g. `global.responseTime.max.lt(5000)`).",
        });
    }
    // atOnceUsers-only tip
    const atOnce = injects.filter((x) => x.kind === "atOnceUsers");
    const rampish = injects.filter((x) => /^(rampUsers|rampUsersPerSec|constantUsersPerSec|stressPeakUsers|heavisideUsers|increment)/.test(x.kind));
    if (atOnce.length >= 1 && rampish.length === 0 && injects.length === atOnce.length) {
        findings.push({
            severity: "info",
            rule: "atOnceUsers_only_tip",
            advice: `Found ${atOnce.length}× \`atOnceUsers\` and no ramp / constantUsersPerSec / stressPeakUsers (etc.). Open-workload ramps (\`rampUsers\`, \`constantUsersPerSec\`) often model production better than a single spike.`,
        });
    }
    // hardcoded credentials tip
    const credPatterns = [
        /\b(?:password|passwd|pwd|secret|api[_-]?key|token|authorization)\s*[=:]\s*["'][^"']{3,}["']/i,
        /\.basicAuth\s*\(\s*["'][^"']+["']\s*,\s*["'][^"']+["']\s*\)/,
        /\.header\s*\(\s*["']Authorization["']\s*,\s*["'][^"']+["']\s*\)/i,
        /\bBearer\s+[A-Za-z0-9\-._~+/]+=*/,
    ];
    let credHits = 0;
    for (const re of credPatterns) {
        credHits += countOccurrences(cleaned, re);
    }
    if (credHits >= 1) {
        findings.push({
            severity: "warn",
            rule: "hardcoded_credentials_tip",
            advice: `Found ${credHits}× likely hardcoded credential / auth header pattern(s). Prefer Gatling feeders, system properties, or env-injected EL (\`\${...}\`) so secrets stay out of simulation source.`,
        });
    }
    // maxDuration missing tip when setUp has inject but no maxDuration
    if (/\bsetUp\s*\(/.test(cleaned) &&
        injects.length > 0 &&
        !/\.maxDuration\s*\(/.test(cleaned)) {
        findings.push({
            severity: "info",
            rule: "maxDuration_missing_tip",
            advice: "`setUp(...).inject(...)` without `.maxDuration(...)` in this text. Consider capping the run with `maxDuration` so open-workload injections cannot run unbounded.",
        });
    }
    // pause missing tip when many requests and no pause/pace
    const execGet = countOccurrences(cleaned, /\.exec\s*\(/g) +
        countOccurrences(cleaned, /\bhttp\s*\(\s*["']/g);
    const hasPause = /\.pause\s*\(/.test(cleaned) ||
        /\.pace\s*\(/.test(cleaned) ||
        /\.thinkTime\b/.test(cleaned);
    if (execGet >= 3 && !hasPause && scenarios.length > 0) {
        findings.push({
            severity: "info",
            rule: "missing_pause_tip",
            advice: "Several `.exec(` / `http(\"...\")` calls without `.pause(` / `.pace(` in this text. Think-time pauses make virtual-user pacing more realistic.",
        });
    }
    // Simulation class without setUp
    if (/\bextends\s+Simulation\b/.test(cleaned) &&
        !/\bsetUp\s*\(/.test(cleaned)) {
        findings.push({
            severity: "warn",
            rule: "simulation_without_setup_tip",
            advice: "`extends Simulation` without `setUp(` in this text. Gatling entrypoint normally wires scenarios via `setUp(scn.inject(...))`.",
        });
    }
    return findings;
}
