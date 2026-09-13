export type HelmTemplatesHintInput = {
    text: string;
};
export type HelmTemplatesHintOutput = {
    kinds: string[];
    valuesRefs: string[];
    helpers: string[];
    count: number;
};
export declare function helmTemplatesHint(input: HelmTemplatesHintInput): HelmTemplatesHintOutput;
