import { listEntities } from "../lib/typeorm_entity.js";
export function typeormEntitiesList(input) {
    return listEntities(input.text ?? "");
}
