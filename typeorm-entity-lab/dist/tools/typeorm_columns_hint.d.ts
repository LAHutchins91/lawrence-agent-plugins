import { type ColumnInfo } from "../lib/typeorm_entity.js";
export type TypeormColumnsHintInput = {
    text: string;
};
export type TypeormColumnsHintOutput = {
    columns: ColumnInfo[];
    count: number;
};
export declare function typeormColumnsHint(input: TypeormColumnsHintInput): TypeormColumnsHintOutput;
