export type ConsulServicesListInput = {
    text: string;
};
export type ConsulServicesListOutput = {
    services: Array<{
        name?: string;
        port?: number;
        tags?: string[];
        kind?: string;
    }>;
    count: number;
};
export declare function consulServicesList(input: ConsulServicesListInput): ConsulServicesListOutput;
