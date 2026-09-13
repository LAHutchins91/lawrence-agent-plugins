export type AnsibleRolesHintInput = {
    text: string;
};
export type AnsibleRolesHintOutput = {
    roles: string[];
    count: number;
};
export declare function ansibleRolesHint(input: AnsibleRolesHintInput): AnsibleRolesHintOutput;
