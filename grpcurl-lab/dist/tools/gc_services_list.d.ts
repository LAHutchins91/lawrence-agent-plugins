export type GcServicesListInput = {
    text: string;
};
export type GcServicesListOutput = {
    targets: {
        host?: string;
    }[];
    services: string[];
    count: number;
};
export declare function gcServicesList(input: GcServicesListInput): GcServicesListOutput;
