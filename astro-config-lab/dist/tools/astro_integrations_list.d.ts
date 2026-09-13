import { type IntegrationsListResult } from "../lib/astro_config.js";
export type AstroIntegrationsListInput = {
    text: string;
};
export type AstroIntegrationsListOutput = IntegrationsListResult;
export declare function astroIntegrationsList(input: AstroIntegrationsListInput): AstroIntegrationsListOutput;
