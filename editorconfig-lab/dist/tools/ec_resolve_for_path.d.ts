export type EcResolveForPathInput = {
    text: string;
    path: string;
};
export type EcResolveForPathOutput = {
    matched: Array<{
        section: string;
        glob?: string;
    }>;
    properties: Record<string, string>;
    path: string;
};
export declare function ecResolveForPath(input: EcResolveForPathInput): EcResolveForPathOutput;
