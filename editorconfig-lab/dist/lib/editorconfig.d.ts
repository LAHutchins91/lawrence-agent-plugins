/**
 * Shared .editorconfig text helpers.
 * Pure string analysis — no network, no filesystem walks beyond pasted text.
 *
 * EditorConfig is INI-like: optional root=true, [#|;] comments, [glob] sections,
 * key = value properties. Glob matching is best-effort EditorConfig rules.
 */
export type Finding = {
    severity: "info" | "warn" | "error";
    rule: string;
    advice: string;
};
export type EcSection = {
    name: string;
    glob?: string;
    properties: Record<string, string>;
};
export type ParsedEditorConfig = {
    root?: boolean;
    sections: EcSection[];
    sectionCount: number;
};
declare const KNOWN_KEYS: Set<string>;
/**
 * Parse INI-like .editorconfig text into root flag + sections.
 */
export declare function parseEditorConfigText(text: string): ParsedEditorConfig;
/** Normalize path for matching. */
export declare function normalizeMatchPath(path: string): string;
/**
 * Best-effort EditorConfig glob match.
 * Patterns without `/` match the basename; with `/` or `**` match the full relative path.
 */
export declare function globMatchesPath(glob: string, path: string): boolean;
export type ResolveResult = {
    matched: Array<{
        section: string;
        glob?: string;
    }>;
    properties: Record<string, string>;
    path: string;
};
/** Glob-match path against sections; later sections override earlier for same keys. */
export declare function resolveForPath(text: string, path: string): ResolveResult;
export type SectionDiff = {
    section: string;
    onlyA: string[];
    onlyB: string[];
    changed: Array<{
        key: string;
        a?: string;
        b?: string;
    }>;
};
export type DiffResult = {
    onlyA: string[];
    onlyB: string[];
    changed: Array<{
        key: string;
        a?: string;
        b?: string;
    }>;
    sectionDiffs: SectionDiff[];
};
/** Diff section names and property values between two configs. */
export declare function diffSections(textA: string, textB: string): DiffResult;
/** Educational heuristic lite lint for .editorconfig text. */
export declare function lintEditorConfig(text: string): Finding[];
export { KNOWN_KEYS };
