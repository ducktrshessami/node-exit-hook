import Hook, { ExitHookOptions } from "./ExitHook";

export function exitHook(cronExpression: string, options: ExitHookOptions = {}): ExitHook {
    return new Hook(cronExpression, options);
}

export type ExitHook = Hook;
export { ExitHookOptions };
