import { type ImportInfo } from "../lib/cdk8s_heuristics.js";
export type Cdk8sImportsHintInput = {
    text: string;
};
export type Cdk8sImportsHintOutput = {
    imports: ImportInfo[];
    count: number;
};
export declare function cdk8sImportsHint(input: Cdk8sImportsHintInput): Cdk8sImportsHintOutput;
