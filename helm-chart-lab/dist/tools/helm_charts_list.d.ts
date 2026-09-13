import { type ChartInfo } from "../lib/helm_heuristics.js";
export type HelmChartsListInput = {
    text: string;
};
export type HelmChartsListOutput = {
    charts: ChartInfo[];
    count: number;
};
export declare function helmChartsList(input: HelmChartsListInput): HelmChartsListOutput;
