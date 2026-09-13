export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
/**
 * Plugins from `generates` / `plugins`; optional generate target paths.
 * `count` = plugins.length.
 */
export declare function listPlugins(text: string): {
    plugins: string[];
    generates?: string[];
    count: number;
};
/**
 * schema / documents from config fields.
 * `count` = schema entries + documents entries.
 */
export declare function listDocuments(text: string): {
    schema?: string | string[];
    documents?: string | string[];
    count: number;
};
/**
 * Scalars from config.scalars / top-level scalars.
 */
export declare function listScalars(text: string): {
    scalars: Record<string, string>;
    count: number;
};
export declare function lintGraphqlCodegen(text: string): Finding[];
