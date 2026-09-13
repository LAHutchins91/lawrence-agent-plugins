import { type PrismaDatasource, type PrismaGenerator } from "../lib/prisma_schema.js";
export type PrismaDatasourcesInput = {
    text: string;
};
export type PrismaDatasourcesOutput = {
    datasources: PrismaDatasource[];
    generators?: PrismaGenerator[];
};
export declare function prismaDatasources(input: PrismaDatasourcesInput): PrismaDatasourcesOutput;
