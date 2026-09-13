export type SaltPillarsHintInput = {
    text: string;
};
export type SaltPillarsHintOutput = {
    pillars: string[];
    secretKeyNames?: string[];
    count: number;
};
export declare function saltPillarsHint(input: SaltPillarsHintInput): SaltPillarsHintOutput;
