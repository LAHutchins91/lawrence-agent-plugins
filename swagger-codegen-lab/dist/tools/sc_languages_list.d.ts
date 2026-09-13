export type ScLanguagesListInput = {
    text: string;
};
export type ScLanguagesListOutput = {
    languages: string[];
    generators?: string[];
    count: number;
};
export declare function scLanguagesList(input: ScLanguagesListInput): ScLanguagesListOutput;
