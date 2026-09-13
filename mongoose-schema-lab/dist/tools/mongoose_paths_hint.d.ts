import { type PathInfo } from "../lib/mongoose_schema.js";
export type MongoosePathsHintInput = {
    text: string;
};
export type MongoosePathsHintOutput = {
    paths: PathInfo[];
    count: number;
};
export declare function mongoosePathsHint(input: MongoosePathsHintInput): MongoosePathsHintOutput;
