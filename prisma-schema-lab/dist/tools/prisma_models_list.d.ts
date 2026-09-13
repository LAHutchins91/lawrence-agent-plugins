import { type PrismaEnum, type PrismaModel } from "../lib/prisma_schema.js";
export type PrismaModelsListInput = {
    text: string;
};
export type PrismaModelsListOutput = {
    models: PrismaModel[];
    enums?: PrismaEnum[];
    count: number;
};
export declare function prismaModelsList(input: PrismaModelsListInput): PrismaModelsListOutput;
