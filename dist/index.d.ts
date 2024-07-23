declare class ExitHook {
    readonly cronExpression: string;
    readonly options: Readonly<ParsedExitHookOptions>;
    private _active;
    private job;
    private jobComplete;
    private restartTimeout;
    private maxTimeout;
    constructor(cronExpression: string, options: ExitHookOptions);
    get active(): boolean;
    get destroyed(): boolean;
    private static parseOptions;
    private logVerbose;
    private clearRestartTimeout;
    private clearTimeouts;
    private exit;
    private task;
    destroy(): void;
    start(): void;
    stop(): void;
}
type Awaitable<T> = T | Promise<T>;
type BeforeExitHook = () => Awaitable<void>;
type ParsedExitHookOptions = {
    verbose: boolean;
    restartDelay: number;
    maxDelay?: number;
    active: boolean;
    beforeExit?: BeforeExitHook;
    exitCode: number;
    errorExitCode: number;
};
type ExitHookOptions = {
    [key in keyof ParsedExitHookOptions]?: ParsedExitHookOptions[key];
};

declare function exitHook(cronExpression: string, options?: ExitHookOptions): ExitHook;

export { ExitHook, type ExitHookOptions, exitHook };
