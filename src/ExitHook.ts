import { schedule, ScheduledTask } from "node-cron";

export default class ExitHook {
    private readonly options: ParsedExitHookOptions;
    private _active: boolean;
    private job: ScheduledTask | null;

    constructor(cronExpression: string, options: ExitHookOptions) {
        this.options = ExitHook.parseOptions(options);
        this._active = this.options.active;
        this.job = schedule(cronExpression, this.task, { scheduled: this.options.active });
    }

    private static parseOptions(options: ExitHookOptions): ParsedExitHookOptions {
        return {
            ...options,
            active: options.active ?? true,
            exitCode: options.exitCode ?? 0
        };
    }

    private async exit(): Promise<void> {
        if (this.options.beforeExit) {
            await this.options.beforeExit();
        }
        process.exit(this.options.exitCode);
    }

    private async task(): Promise<void> {
        if (this._active) {
            await this.exit();
        }
        else {
            // timeouts
        }
    }

    get active(): boolean {
        return this._active;
    }

    get destroyed(): boolean {
        return !!this.job;
    }

    destroy(): void {
        if (this.job) {
            this.job.stop();
            this.job = null;
        }
    }
}

type Awaitable<T> = T | Promise<T>;

type BeforeExitHook = () => Awaitable<void>;

export type ExitHookOptions = {
    active?: boolean;
    exitCode?: number;
    beforeExit?: BeforeExitHook
};

type ParsedExitHookOptions = {
    active: boolean;
    exitCode: number;
    beforeExit?: BeforeExitHook
};
