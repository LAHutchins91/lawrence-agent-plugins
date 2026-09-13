export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type StateInfo = {
    id?: string;
    module?: string;
    fun?: string;
};
export declare function asMap(value: unknown): Record<string, unknown> | null;
export declare function strField(map: Record<string, unknown> | null, key: string): string | undefined;
/** Best-effort YAML parse; returns null on empty/invalid. */
export declare function parseYamlObject(text: string): unknown | null;
export declare function parseYamlDocs(text: string): unknown[];
/**
 * Extract state IDs and modules from SLS YAML.
 * Salt SLS shape:
 *   state_id:
 *     pkg.installed:
 *       - name: nginx
 *     service.running:
 *       - enable: True
 */
export declare function extractStates(text: string): StateInfo[];
export type PillarsHint = {
    pillars: string[];
    secretKeyNames: string[];
};
/** Extract pillar keys from pillar YAML / {% pillar %} / pillar.get refs. */
export declare function extractPillars(text: string): PillarsHint;
/** Detect grain refs: grains[...], grains.get, salt['grains.get'], jinja grains. */
export declare function extractGrains(text: string): string[];
export declare function lintSalt(text: string): Finding[];
