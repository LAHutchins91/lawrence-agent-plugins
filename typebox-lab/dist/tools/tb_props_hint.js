import { listProps } from "../lib/typebox_schema.js";
export function tbPropsHint(input) {
    return listProps(input.text ?? "");
}
