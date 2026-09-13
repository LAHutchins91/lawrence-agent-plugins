import { listServices } from "../lib/app_spec.js";
export type DoServicesListInput = {
    text: string;
};
export type DoServicesListOutput = ReturnType<typeof listServices>;
export declare function doServicesList(input: DoServicesListInput): DoServicesListOutput;
