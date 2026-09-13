import { type EntityInfo } from "../lib/typeorm_entity.js";
export type TypeormEntitiesListInput = {
    text: string;
};
export type TypeormEntitiesListOutput = {
    entities: EntityInfo[];
    count: number;
};
export declare function typeormEntitiesList(input: TypeormEntitiesListInput): TypeormEntitiesListOutput;
