export type GatScenariosListInput = {
    text: string;
};
export type GatScenariosListOutput = {
    scenarios: {
        name: string;
    }[];
    protocols?: string[];
    count: number;
};
export declare function gatScenariosList(input: GatScenariosListInput): GatScenariosListOutput;
