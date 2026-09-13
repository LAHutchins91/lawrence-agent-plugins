import { type Finding } from "../lib/prisma_schema.js";
export type PrismaLintLiteInput = {
    text: string;
};
export type PrismaLintLiteOutput = {
    findings: Finding[];
    findingCount: number;
};
export declare function prismaLintLite(input: PrismaLintLiteInput): PrismaLintLiteOutput;
