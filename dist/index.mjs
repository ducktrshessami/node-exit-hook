import{schedule as s}from"node-cron";var e=class i{constructor(t,o){this.cronExpression=t;this.options=i.parseOptions(o),this._active=this.options.active,this.job=s(this.cronExpression,this.task.bind(this),{scheduled:this.options.active}),this.jobComplete=!1,this.restartTimeout=null,this.maxTimeout=null,this.options.active&&this.logVerbose(`Exit scheduled with pattern "${this.cronExpression}"`)}get active(){return this._active}get destroyed(){return!!this.job}static parseOptions(t){return Object.freeze({...t,verbose:t.verbose??!1,restartDelay:t.restartDelay??0,active:t.active??!0,exitCode:t.exitCode??0,errorExitCode:t.errorExitCode??1})}logVerbose(...t){this.options.verbose&&console.debug("[exit-hook]",...t)}clearRestartTimeout(){this.restartTimeout&&(clearTimeout(this.restartTimeout),this.restartTimeout=null)}clearTimeouts(){this.clearRestartTimeout(),this.maxTimeout&&(clearTimeout(this.maxTimeout),this.maxTimeout=null)}async exit(){let t=this.options.exitCode;try{this.clearTimeouts(),this.logVerbose("Exit triggered"),this.options.beforeExit&&(this.logVerbose("Executing before-exit hook"),await this.options.beforeExit())}catch(o){console.error(o),t=this.options.errorExitCode}finally{this.logVerbose(`Exiting with code ${t}`),process.exit(t)}}async task(){this.jobComplete=!0,this.job.stop(),this.logVerbose("Cron job completed"),this._active?await this.exit():this.options.maxDelay&&(this.logVerbose(`Max delay set. Exiting in ${this.options.maxDelay} ms`),this.maxTimeout=setTimeout(this.exit.bind(this),this.options.maxDelay))}destroy(){this.job&&(this.job.stop(),this.clearTimeouts(),this.job=null,this._active=!1,this.logVerbose("Hook destroyed"))}start(){this.job&&!this._active&&(this.logVerbose("Starting hook"),this.jobComplete?(this.logVerbose(`Hook started after cron job completed. Exiting in ${this.options.restartDelay} ms`),this.restartTimeout=setTimeout(this.exit.bind(this),this.options.restartDelay)):(this.job.start(),this.logVerbose(`Exit scheduled with pattern "${this.cronExpression}"`)),this._active=!0)}stop(){this.job&&this._active&&(this.logVerbose("Stopping hook"),this.clearRestartTimeout(),this._active=!1)}};function p(i,t={}){return new e(i,t)}export{e as ExitHook,p as exitHook};
//# sourceMappingURL=index.mjs.map