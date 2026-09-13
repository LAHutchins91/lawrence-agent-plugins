import { diffSections } from "../lib/editorconfig.js";
export type EcDiffSectionsInput = {
    textA: string;
    textB: string;
};
export type EcDiffSectionsOutput = ReturnType<typeof diffSections>;
export declare function ecDiffSections(input: EcDiffSectionsInput): EcDiffSectionsOutput;
