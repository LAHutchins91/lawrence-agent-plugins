import { type Finding } from "../lib/mongoose_schema.js";
export type MongooseLintLiteInput = {
    text: string;
};
export type MongooseLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function mongooseLintLite(input: MongooseLintLiteInput): MongooseLintLiteOutput;
