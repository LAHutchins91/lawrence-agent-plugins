export type ChefAttrsHintInput = {
    text: string;
};
export type ChefAttrsHintOutput = {
    attrs: string[];
    secretKeyNames?: string[];
    count: number;
};
export declare function chefAttrsHint(input: ChefAttrsHintInput): ChefAttrsHintOutput;
