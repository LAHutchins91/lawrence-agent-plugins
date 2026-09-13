import { listDtos } from "../lib/cv_schema.js";
export function cvDtosList(input) {
    return listDtos(input.text ?? "");
}
