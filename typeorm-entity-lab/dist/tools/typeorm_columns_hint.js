import { listColumns } from "../lib/typeorm_entity.js";
export function typeormColumnsHint(input) {
    return listColumns(input.text ?? "");
}
