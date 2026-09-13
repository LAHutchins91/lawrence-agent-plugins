import { type Finding } from "../lib/vercel_json.js";
export type VercelLintLiteInput = {
    text: string;
};
export type VercelLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function vercelLintLite(input: VercelLintLiteInput): VercelLintLiteOutput;
