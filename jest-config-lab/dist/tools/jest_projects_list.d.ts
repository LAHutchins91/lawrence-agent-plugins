import { type ProjectsList } from "../lib/jest_config.js";
export type JestProjectsListInput = {
    text: string;
};
export type JestProjectsListOutput = ProjectsList;
export declare function jestProjectsList(input: JestProjectsListInput): JestProjectsListOutput;
