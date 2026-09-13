import { type VercelRedirect } from "../lib/vercel_json.js";
export type VercelRedirectsListInput = {
    text: string;
};
export type VercelRedirectsListOutput = {
    redirects: VercelRedirect[];
    count: number;
};
export declare function vercelRedirectsList(input: VercelRedirectsListInput): VercelRedirectsListOutput;
