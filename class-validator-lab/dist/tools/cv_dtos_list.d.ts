import { type DtoInfo } from "../lib/cv_schema.js";
export type CvDtosListInput = {
    text: string;
};
export type CvDtosListOutput = {
    dtos: DtoInfo[];
    count: number;
};
export declare function cvDtosList(input: CvDtosListInput): CvDtosListOutput;
