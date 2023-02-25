import ExitHook, { ExitHookOptions } from "./ExitHook";

export function exitHook(cronExpression: string, options: ExitHookOptions = {}): ExitHook {
    return new ExitHook(cronExpression, options);
}

export { type default as ExitHook, ExitHookOptions } from "./ExitHook";
