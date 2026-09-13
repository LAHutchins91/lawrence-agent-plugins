export type ToxCommandsEnv = {
    name: string;
    commands: string[];
};
export type ToxCommandsMapResult = {
    envs: ToxCommandsEnv[];
    count: number;
};
/**
 * From [testenv] / [testenv:NAME] commands / commands_pre / commands_post (multiline).
 * Order: commands_pre, then commands, then commands_post.
 */
export declare function toxCommandsMap(args: {
    text: string;
}): ToxCommandsMapResult;
