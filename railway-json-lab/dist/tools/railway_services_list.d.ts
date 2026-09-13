import { type RailwayService } from "../lib/railway_config.js";
export type RailwayServicesListInput = {
    text: string;
};
export type RailwayServicesListOutput = {
    services: RailwayService[];
    count: number;
};
export declare function railwayServicesList(input: RailwayServicesListInput): RailwayServicesListOutput;
