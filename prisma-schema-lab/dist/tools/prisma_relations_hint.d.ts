import { type PrismaRelation } from "../lib/prisma_schema.js";
export type PrismaRelationsHintInput = {
    text: string;
};
export type PrismaRelationsHintOutput = {
    relations: PrismaRelation[];
    count: number;
};
export declare function prismaRelationsHint(input: PrismaRelationsHintInput): PrismaRelationsHintOutput;
