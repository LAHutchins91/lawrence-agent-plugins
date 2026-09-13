export type GqlcScalarsHintInput = {
    text: string;
};
export type GqlcScalarsHintOutput = {
    scalars: Record<string, string>;
    count: number;
};
export declare function gqlcScalarsHint(input: GqlcScalarsHintInput): GqlcScalarsHintOutput;
