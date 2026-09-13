/**
 * toml_parse_lite — documented subset of TOML for common configs (not full 1.0).
 */
import type { ParseError } from "./types.js";
export declare const TOML_LIMITATIONS_NOTE = "Not a full TOML 1.0 parser. Supported: bare/quoted/dotted keys; basic and literal strings (including multiline); integers and floats (underscores, scientific, +/\u2212); booleans; arrays of those values; inline tables; [tables]; [[arrays of tables]]; # comments. Not supported / incomplete: hex/oct/bin integers, +inf/\u2212inf/nan, native date-time types (ISO-ish tokens are kept as strings), strict array type homogeneity, table-redefinition / dotted-key merge edge cases, Unicode escape validation, and other TOML 1.0 corner cases.";
export interface TomlParseLiteInput {
    text: string;
}
export interface TomlParseLiteOk {
    ok: true;
    data: Record<string, unknown>;
    limitationsNote: string;
}
export interface TomlParseLiteErr {
    ok: false;
    errors: ParseError[];
    limitationsNote: string;
}
export type TomlParseLiteResult = TomlParseLiteOk | TomlParseLiteErr;
export declare function tomlParseLite(input: TomlParseLiteInput): TomlParseLiteResult;
