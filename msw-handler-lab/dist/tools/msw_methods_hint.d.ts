export type MswMethodsHintInput = {
    text: string;
};
export type MswMethodsHintOutput = {
    methods: Record<string, number>;
    total: number;
};
export declare function mswMethodsHint(input: MswMethodsHintInput): MswMethodsHintOutput;
