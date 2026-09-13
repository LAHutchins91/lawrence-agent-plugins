export type SaltGrainsHintInput = {
    text: string;
};
export type SaltGrainsHintOutput = {
    grains: string[];
    count: number;
};
export declare function saltGrainsHint(input: SaltGrainsHintInput): SaltGrainsHintOutput;
