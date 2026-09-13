import { listProps } from "../lib/fast_check.js";
export function fcPropsHint(input) {
    return listProps(input.text ?? "");
}
