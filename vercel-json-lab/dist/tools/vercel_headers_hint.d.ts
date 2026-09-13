import { type VercelHeadersRule } from "../lib/vercel_json.js";
export type VercelHeadersHintInput = {
    text: string;
};
export type VercelHeadersHintOutput = {
    headers: VercelHeadersRule[];
    count: number;
    keys: string[];
};
export declare function vercelHeadersHint(input: VercelHeadersHintInput): VercelHeadersHintOutput;
