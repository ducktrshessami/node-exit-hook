import ExitHook, { ExitHookOptions } from "./ExitHook";

export function exitHook(cronExpression: string, options: ExitHookOptions = {}): ExitHook {
    return new ExitHook(cronExpression, options);
}

export { ExitHook, ExitHookOptions };
