"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = require("node-cron");
class ExitHook {
    constructor(cronExpression, options) {
        this.options = ExitHook.parseOptions(options);
        this._active = this.options.active;
        this.job = (0, node_cron_1.schedule)(cronExpression, this.task.bind(this), { scheduled: this.options.active });
        this.jobComplete = false;
        this.restartTimeout = null;
        this.maxTimeout = null;
    }
    static parseOptions(options) {
        return {
            ...options,
            restartDelay: options.restartDelay ?? 0,
            active: options.active ?? true,
            exitCode: options.exitCode ?? 0,
            errorExitCode: options.errorExitCode ?? 1
        };
    }
    clearRestartTimeout() {
        if (this.restartTimeout) {
            clearTimeout(this.restartTimeout);
            this.restartTimeout = null;
        }
    }
    clearTimeouts() {
        this.clearRestartTimeout();
        if (this.maxTimeout) {
            clearTimeout(this.maxTimeout);
            this.maxTimeout = null;
        }
    }
    async exit() {
        let exitCode = this.options.exitCode;
        try {
            this.clearTimeouts();
            if (this.options.beforeExit) {
                await this.options.beforeExit();
            }
        }
        catch (err) {
            console.error(err);
            exitCode = this.options.errorExitCode;
        }
        finally {
            process.exit(exitCode);
        }
    }
    async task() {
        this.jobComplete = true;
        this.job.stop();
        if (this._active) {
            await this.exit();
        }
        else if (this.options.maxDelay) {
            this.maxTimeout = setTimeout(this.exit, this.options.maxDelay);
        }
    }
    get active() {
        return this._active;
    }
    get destroyed() {
        return !!this.job;
    }
    destroy() {
        if (this.job) {
            this.job.stop();
            this.clearTimeouts();
            this.job = null;
            this._active = false;
        }
    }
    start() {
        if (this.job && !this._active) {
            if (this.jobComplete) {
                this.restartTimeout = setTimeout(this.exit, this.options.restartDelay);
            }
            else {
                this.job.start();
            }
            this._active = true;
        }
    }
    stop() {
        if (this.job && this._active) {
            this.clearRestartTimeout();
            this._active = false;
        }
    }
}
exports.default = ExitHook;
