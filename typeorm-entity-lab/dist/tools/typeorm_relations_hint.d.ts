import { type RelationInfo } from "../lib/typeorm_entity.js";
export type TypeormRelationsHintInput = {
    text: string;
};
export type TypeormRelationsHintOutput = {
    relations: RelationInfo[];
    count: number;
};
export declare function typeormRelationsHint(input: TypeormRelationsHintInput): TypeormRelationsHintOutput;
