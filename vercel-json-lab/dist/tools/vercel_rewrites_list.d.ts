import { type VercelRewrite } from "../lib/vercel_json.js";
export type VercelRewritesListInput = {
    text: string;
};
export type VercelRewritesListOutput = {
    rewrites: VercelRewrite[];
    count: number;
};
export declare function vercelRewritesList(input: VercelRewritesListInput): VercelRewritesListOutput;
