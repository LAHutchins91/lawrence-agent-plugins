import { type ModelInfo } from "../lib/mongoose_schema.js";
export type MongooseModelsListInput = {
    text: string;
};
export type MongooseModelsListOutput = {
    models: ModelInfo[];
    schemas?: string[];
    count: number;
};
export declare function mongooseModelsList(input: MongooseModelsListInput): MongooseModelsListOutput;
