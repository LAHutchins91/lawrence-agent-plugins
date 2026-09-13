/**
 * Best-effort protoc CLI text heuristics.
 * No protoc/protobuf compiler runtime, no network, no filesystem follow, no eval.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type PluginInfo = {
    name: "cpp" | "python" | "go" | "js" | "grpc" | string;
    out?: string;
};
export type OptionInfo = {
    flag: string;
    value?: string;
};
/** Strip BOM, normalize newlines, drop # / // comments (quote-aware; keep ://). */
export declare function stripComments(raw: string): string;
/**
 * List -I / --proto_path includes and trailing .proto files.
 * `count` = number of include paths.
 */
export declare function listIncludes(text: string): {
    includes: string[];
    protos: string[];
    count: number;
};
/**
 * Extract plugins from --*_out and --plugin=.
 */
export declare function listPlugins(text: string): {
    plugins: PluginInfo[];
    count: number;
};
/**
 * Other common flags: --descriptor_set_out, --include_imports,
 * --experimental_allow_proto3_optional, etc. (excludes -I/--proto_path, *_out, --plugin).
 */
export declare function listOptions(text: string): {
    options: OptionInfo[];
    count: number;
};
export declare function lintProtoc(text: string): Finding[];
