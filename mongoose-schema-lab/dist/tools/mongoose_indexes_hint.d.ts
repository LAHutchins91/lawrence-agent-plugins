import { type IndexInfo } from "../lib/mongoose_schema.js";
export type MongooseIndexesHintInput = {
    text: string;
};
export type MongooseIndexesHintOutput = {
    indexes: IndexInfo[];
    count: number;
};
export declare function mongooseIndexesHint(input: MongooseIndexesHintInput): MongooseIndexesHintOutput;
