import { listQueries } from "../lib/testing_library_heuristics.js";
export function tlQueriesList(input) {
    return listQueries(input.text ?? "");
}
