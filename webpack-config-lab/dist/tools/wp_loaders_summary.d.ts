import { type LoadersSummary } from "../lib/webpack_config.js";
export type WpLoadersSummaryInput = {
    text: string;
};
export type WpLoadersSummaryOutput = LoadersSummary;
export declare function wpLoadersSummary(input: WpLoadersSummaryInput): WpLoadersSummaryOutput;
