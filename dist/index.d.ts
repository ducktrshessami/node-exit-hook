declare class ExitHook$1 {
    private readonly options;
    private _active;
    private job;
    private jobComplete;
    private restartTimeout;
    private maxTimeout;
    constructor(cronExpression: string, options: ExitHookOptions);
    private static parseOptions;
    private clearRestartTimeout;
    private clearTimeouts;
    private exit;
    private task;
    get active(): boolean;
    get destroyed(): boolean;
    destroy(): void;
    start(): void;
    stop(): void;
}
type Awaitable<T> = T | Promise<T>;
type BeforeExitHook = () => Awaitable<void>;
type ExitHookOptions = {
    restartDelay?: number;
    maxDelay?: number;
    active?: boolean;
    beforeExit?: BeforeExitHook;
    exitCode?: number;
    errorExitCode?: number;
};

declare function exitHook(cronExpression: string, options?: ExitHookOptions): ExitHook;
type ExitHook = ExitHook$1;

export { ExitHook, ExitHookOptions, exitHook };
