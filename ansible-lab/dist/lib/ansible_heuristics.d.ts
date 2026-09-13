export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type PlayInfo = {
    name?: string;
    hosts?: string;
    become?: boolean | string;
    gatherFacts?: boolean | string;
    strategy?: string;
};
export declare function asMap(value: unknown): Record<string, unknown> | null;
export declare function strField(map: Record<string, unknown> | null, key: string): string | undefined;
export declare function boolOrStrField(map: Record<string, unknown> | null, key: string): boolean | string | undefined;
/** Best-effort YAML parse; returns null on empty/invalid. */
export declare function parseYamlObject(text: string): unknown | null;
export declare function parseYamlDocs(text: string): unknown[];
/** Extract plays from playbook YAML (top-level list or single play map). */
export declare function extractPlays(text: string): PlayInfo[];
/** Extract role names from roles:, import_role, include_role, role: name. */
export declare function extractRoles(text: string): string[];
export type VarsHint = {
    vars: string[];
    secretKeyNames: string[];
    varsFiles: string[];
};
/** Extract vars / vars_files / set_fact key names; flag secret-ish key names only. */
export declare function extractVars(text: string): VarsHint;
export declare function lintAnsible(text: string): Finding[];
