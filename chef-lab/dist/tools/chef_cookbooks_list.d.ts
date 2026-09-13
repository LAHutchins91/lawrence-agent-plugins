export type ChefCookbooksListInput = {
    text: string;
};
export type ChefCookbooksListOutput = {
    cookbooks: Array<{
        name?: string;
        version?: string;
        depends?: string[];
        supports?: string[];
    }>;
    count: number;
};
export declare function chefCookbooksList(input: ChefCookbooksListInput): ChefCookbooksListOutput;
