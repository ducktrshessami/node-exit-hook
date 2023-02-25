import { schedule, ScheduledTask } from "node-cron";

export default class ExitHook {
    private readonly options: ParsedExitHookOptions;
    private job: ScheduledTask | null;

    constructor(cronExpression: string, options: ExitHookOptions) {
        this.options = ExitHook.parseOptions(options);
        this.job = schedule(cronExpression, this.task, { scheduled: this.options.active });
    }

    private static parseOptions(options: ExitHookOptions): ParsedExitHookOptions {
        return {
            active: options.active ?? true,
            exitCode: options.exitCode ?? 0
        };
    }

    private task(): void {
        // exit
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

export type ExitHookOptions = {
    active?: boolean;
    exitCode?: number;
};

type ParsedExitHookOptions = {
    active: boolean;
    exitCode: number;
};
