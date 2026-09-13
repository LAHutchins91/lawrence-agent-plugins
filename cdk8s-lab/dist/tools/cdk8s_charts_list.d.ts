import { type ChartInfo } from "../lib/cdk8s_heuristics.js";
export type Cdk8sChartsListInput = {
    text: string;
};
export type Cdk8sChartsListOutput = {
    charts: ChartInfo[];
    count: number;
};
export declare function cdk8sChartsList(input: Cdk8sChartsListInput): Cdk8sChartsListOutput;
