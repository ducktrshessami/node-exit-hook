import { schedule, ScheduledTask } from "node-cron";

export default class ExitHook {
    readonly options: Readonly<ParsedExitHookOptions>;
    private _active: boolean;
    private job: Nullable<ScheduledTask>;
    private jobComplete: boolean;
    private restartTimeout: Nullable<NodeJS.Timeout>;
    private maxTimeout: Nullable<NodeJS.Timeout>;

    constructor(readonly cronExpression: string, options: ExitHookOptions) {
        this.options = ExitHook.parseOptions(options);
        this._active = this.options.active;
        this.job = schedule(
            this.cronExpression,
            this.task.bind(this),
            { scheduled: this.options.active }
        );
        this.jobComplete = false;
        this.restartTimeout = null;
        this.maxTimeout = null;
        if (this.options.active) {
            this.logVerbose(`Exit scheduled with pattern "${this.cronExpression}"`);
        }
    }

    get active(): boolean {
        return this._active;
    }

    get destroyed(): boolean {
        return !!this.job;
    }

    private static parseOptions(options: ExitHookOptions): Readonly<ParsedExitHookOptions> {
        return Object.freeze({
            ...options,
            verbose: options.verbose ?? false,
            restartDelay: options.restartDelay ?? 0,
            active: options.active ?? true,
            exitCode: options.exitCode ?? 0,
            errorExitCode: options.errorExitCode ?? 1
        });
    }

    private logVerbose(...messages: Array<any>): void {
        if (this.options.verbose) {
            console.debug("[exit-hook]", ...messages);
        }
    }

    private clearRestartTimeout(): void {
        if (this.restartTimeout) {
            clearTimeout(this.restartTimeout);
            this.restartTimeout = null;
        }
    }

    private clearTimeouts(): void {
        this.clearRestartTimeout();
        if (this.maxTimeout) {
            clearTimeout(this.maxTimeout);
            this.maxTimeout = null;
        }
    }

    private async exit(): Promise<void> {
        let exitCode: number = this.options.exitCode;
        try {
            this.clearTimeouts();
            if (this.options.beforeExit) {
                await this.options.beforeExit();
            }
        }
        catch (err: any) {
            console.error(err);
            exitCode = this.options.errorExitCode;
        }
        finally {
            process.exit(exitCode);
        }
    }

    private async task(): Promise<void> {
        this.jobComplete = true;
        this.job!.stop();
        if (this._active) {
            await this.exit();
        }
        else if (this.options.maxDelay) {
            this.maxTimeout = setTimeout(this.exit.bind(this), this.options.maxDelay);
        }
    }

    destroy(): void {
        if (this.job) {
            this.job.stop();
            this.clearTimeouts();
            this.job = null;
            this._active = false;
        }
    }

    start(): void {
        if (this.job && !this._active) {
            if (this.jobComplete) {
                this.restartTimeout = setTimeout(this.exit.bind(this), this.options.restartDelay);
            }
            else {
                this.job.start();
                this.logVerbose(`Exit scheduled with pattern "${this.cronExpression}"`);
            }
            this._active = true;
        }
    }

    stop(): void {
        if (this.job && this._active) {
            this.clearRestartTimeout();
            this._active = false;
        }
    }
}

type Nullable<T> = T | null;
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
export type ExitHookOptions = {
    [key in keyof ParsedExitHookOptions]?: ParsedExitHookOptions[key]
};
