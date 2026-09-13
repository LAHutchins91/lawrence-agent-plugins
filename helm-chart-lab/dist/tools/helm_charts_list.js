import { extractChart, parseYamlDocs, parseYamlObject, } from "../lib/helm_heuristics.js";
export function helmChartsList(input) {
    const text = input.text ?? "";
    const trimmed = text.trim();
    if (!trimmed) {
        return { charts: [], count: 0 };
    }
    const docs = parseYamlDocs(trimmed);
    const charts = [];
    if (docs.length === 0) {
        // fallback single parse
        const raw = parseYamlObject(trimmed);
        const c = extractChart(raw);
        if (c)
            charts.push(c);
    }
    else {
        for (const doc of docs) {
            const c = extractChart(doc);
            if (c)
                charts.push(c);
        }
    }
    return { charts, count: charts.length };
}
