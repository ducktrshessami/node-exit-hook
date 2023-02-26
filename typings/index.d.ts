declare class ExitHook {
    get active(): boolean;
    get destroyed(): boolean;
    destroy(): void;
    start(): void;
    stop(): void;
}
export { type ExitHook };
type Awaitable<T> = T | Promise<T>;
type BeforeExitHook = () => Awaitable<void>;
export type ExitHookOptions = {
    restartDelay?: number;
    maxDelay?: number;
    active?: boolean;
    beforeExit?: BeforeExitHook;
    exitCode?: number;
    errorExitCode?: number;
};
export declare function exitHook(cronExpression: string, options?: ExitHookOptions): ExitHook;
