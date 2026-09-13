import { extractServices } from "../lib/consul_heuristics.js";
export function consulServicesList(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { services: [], count: 0 };
    }
    const services = extractServices(text);
    return { services, count: services.length };
}
