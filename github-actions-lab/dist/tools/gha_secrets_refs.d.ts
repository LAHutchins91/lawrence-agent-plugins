export type GhaSecretsRefsInput = {
    text: string;
};
export type GhaSecretsRefsOutput = {
    secrets: string[];
    count: number;
};
/**
 * Extract secrets.NAME / ${{ secrets.NAME }} refs — names only, never values.
 */
export declare function ghaSecretsRefs(input: GhaSecretsRefsInput): GhaSecretsRefsOutput;
