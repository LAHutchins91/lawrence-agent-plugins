import { listRelations } from "../lib/typeorm_entity.js";
export function typeormRelationsHint(input) {
    return listRelations(input.text ?? "");
}
