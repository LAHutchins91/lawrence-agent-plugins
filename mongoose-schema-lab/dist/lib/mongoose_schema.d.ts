/**
 * Best-effort Mongoose schema JS/TS text heuristics.
 * No mongoose/mongo runtime, no network, no filesystem follow, no eval.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type ModelInfo = {
    name: string;
    collection?: string;
};
export type PathInfo = {
    name: string;
    type?: string;
    required?: boolean;
    unique?: boolean;
    ref?: string;
};
export type IndexInfo = {
    fields?: string;
    unique?: boolean;
    sparse?: boolean;
};
/** Strip line and block comments; leave strings roughly intact. */
export declare function stripComments(raw: string): string;
/** Extract schema variable names from `const x = new Schema(` / `new mongoose.Schema(`. */
export declare function listSchemaVars(text: string): string[];
/**
 * List mongoose.model('Name', ...) / model('Name', ...) registrations.
 * Optional 3rd string arg → collection.
 */
export declare function listModels(text: string): {
    models: ModelInfo[];
    schemas?: string[];
    count: number;
};
/**
 * Parse path definitions from Schema object-literal style bodies.
 */
export declare function listPaths(text: string): {
    paths: PathInfo[];
    count: number;
};
/**
 * Indexes from schema.index({...}, opts?) and path-level index:true / unique:true.
 */
export declare function listIndexes(text: string): {
    indexes: IndexInfo[];
    count: number;
};
export declare function lintMongoose(text: string): Finding[];
