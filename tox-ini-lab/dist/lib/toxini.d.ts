/**
 * Shared tox.ini text helpers.
 * String heuristics only — no tox binary, no network, no venv.
 */
export type Finding = {
    severity: "info" | "warning" | "error";
    rule: string;
    advice: string;
};
export type IniSection = {
    name: string;
    /** Lowercased section name for lookups */
    key: string;
    /** Raw keys → multiline values (joined with \n, trimmed per line) */
    props: Record<string, string>;
    /** Line number of the [section] header (1-based) */
    line: number;
};
export type ParsedTox = {
    sections: IniSection[];
    empty: boolean;
};
/**
 * Parse tox.ini-ish INI text into sections with multiline values.
 * Continuation: blank-leading (space/tab) lines append to the current key.
 */
export declare function parseToxIni(text: string): ParsedTox;
export declare function getSection(parsed: ParsedTox, name: string): IniSection | undefined;
export declare function getToxSection(parsed: ParsedTox): IniSection | undefined;
/** All [testenv] and [testenv:NAME] sections */
export declare function getTestenvSections(parsed: ParsedTox): IniSection[];
/** Friendly env name: [testenv] → "testenv", [testenv:py310] → "py310" */
export declare function testenvName(section: IniSection): string;
/**
 * Split a tox list value on commas, respecting braces for factors.
 * Also splits on newlines (each non-empty line is a token, then comma-split).
 */
export declare function splitToxList(value: string): string[];
/**
 * Best-effort expand simple factor forms like py{310,311} or
 * py3{9,10}-django{42,50} (cartesian over brace groups).
 */
export declare function expandFactors(token: string): string[];
export declare function expandEnvlist(raw: string): {
    envlist: string[];
    expanded: string[];
};
/** Split multiline command/deps values into individual items (one per non-empty line, or comma for single-line). */
export declare function splitMultilineItems(value: string): string[];
export declare function splitDepsItems(value: string): string[];
export declare function looksLikeSecretPassenv(name: string): boolean;
export declare function parsePassenv(value: string): string[];
