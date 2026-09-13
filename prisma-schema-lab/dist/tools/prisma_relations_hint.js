import { listRelations, } from "../lib/prisma_schema.js";
export function prismaRelationsHint(input) {
    return listRelations(input.text ?? "");
}
