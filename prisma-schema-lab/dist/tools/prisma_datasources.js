import { listDatasources, } from "../lib/prisma_schema.js";
export function prismaDatasources(input) {
    return listDatasources(input.text ?? "");
}
