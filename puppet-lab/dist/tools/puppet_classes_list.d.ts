export type PuppetClassesListInput = {
    text: string;
};
export type PuppetClassesListOutput = {
    classes: Array<{
        name: string;
        kind?: "class" | "define";
    }>;
    count: number;
};
export declare function puppetClassesList(input: PuppetClassesListInput): PuppetClassesListOutput;
