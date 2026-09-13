export type GcMethodsHintInput = {
    text: string;
};
export type GcMethodsHintOutput = {
    methods: {
        service?: string;
        method?: string;
    }[];
    count: number;
};
export declare function gcMethodsHint(input: GcMethodsHintInput): GcMethodsHintOutput;
