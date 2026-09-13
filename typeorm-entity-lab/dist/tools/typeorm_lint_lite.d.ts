import { type Finding } from "../lib/typeorm_entity.js";
export type TypeormLintLiteInput = {
    text: string;
};
export type TypeormLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function typeormLintLite(input: TypeormLintLiteInput): TypeormLintLiteOutput;
