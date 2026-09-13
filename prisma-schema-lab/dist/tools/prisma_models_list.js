import { listModels } from "../lib/prisma_schema.js";
export function prismaModelsList(input) {
    return listModels(input.text ?? "");
}
