export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type ConfigInfo = {
    path?: string;
    keys?: string[];
};
export type TemplateInfo = {
    path?: string;
};
/** Strip BOM, normalize newlines, drop # / // comments (quote-aware; keep ://). */
export declare function stripComments(raw: string): string;
/**
 * Languages from -l/--lang; generators from -g/--generator-name.
 * `languages` also includes generator names for a unified inventory.
 * `count` = languages.length.
 */
export declare function listLanguages(text: string): {
    languages: string[];
    generators?: string[];
    count: number;
};
/**
 * Config paths from -c/--config; additionalProperties from -p/--additional-properties / -D.
 * Optional light JSON/YAML key extraction when a config document is pasted inline.
 */
export declare function listConfigs(text: string): {
    configs: ConfigInfo[];
    additionalProperties?: Record<string, string>;
    count: number;
};
/**
 * Templates from -t/--template-dir; library from --library.
 */
export declare function listTemplates(text: string): {
    templates: TemplateInfo[];
    library?: string;
    count: number;
};
export declare function lintSwaggerCodegen(text: string): Finding[];
