export type AnsibleVarsHintInput = {
    text: string;
};
export type AnsibleVarsHintOutput = {
    vars: string[];
    secretKeyNames?: string[];
    varsFiles?: string[];
    count: number;
};
export declare function ansibleVarsHint(input: AnsibleVarsHintInput): AnsibleVarsHintOutput;
