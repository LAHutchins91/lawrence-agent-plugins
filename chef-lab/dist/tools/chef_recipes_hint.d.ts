export type ChefRecipesHintInput = {
    text: string;
};
export type ChefRecipesHintOutput = {
    resources: Array<{
        type?: string;
        name?: string;
    }>;
    includes?: string[];
    count: number;
};
export declare function chefRecipesHint(input: ChefRecipesHintInput): ChefRecipesHintOutput;
