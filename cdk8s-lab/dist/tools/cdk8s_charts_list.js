import { extractCharts } from "../lib/cdk8s_heuristics.js";
export function cdk8sChartsList(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { charts: [], count: 0 };
    }
    const charts = extractCharts(text);
    return { charts, count: charts.length };
}
