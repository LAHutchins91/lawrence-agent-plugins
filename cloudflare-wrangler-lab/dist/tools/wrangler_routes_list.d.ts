import { type WranglerRoute } from "../lib/wrangler_toml.js";
export type WranglerRoutesListInput = {
    text: string;
};
export type WranglerRoutesListOutput = {
    routes: WranglerRoute[];
    count: number;
};
export declare function wranglerRoutesList(input: WranglerRoutesListInput): WranglerRoutesListOutput;
