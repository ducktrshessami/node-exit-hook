import{schedule as s}from"node-cron";var e=class{constructor(t,i){this.options=e.parseOptions(i),this._active=this.options.active,this.job=s(t,this.task.bind(this),{scheduled:this.options.active}),this.jobComplete=!1,this.restartTimeout=null,this.maxTimeout=null}static parseOptions(t){return{...t,restartDelay:t.restartDelay??0,active:t.active??!0,exitCode:t.exitCode??0,errorExitCode:t.errorExitCode??1}}clearRestartTimeout(){this.restartTimeout&&(clearTimeout(this.restartTimeout),this.restartTimeout=null)}clearTimeouts(){this.clearRestartTimeout(),this.maxTimeout&&(clearTimeout(this.maxTimeout),this.maxTimeout=null)}async exit(){let t=this.options.exitCode;try{this.clearTimeouts(),this.options.beforeExit&&await this.options.beforeExit()}catch(i){console.error(i),t=this.options.errorExitCode}finally{process.exit(t)}}async task(){this.jobComplete=!0,this.job.stop(),this._active?await this.exit():this.options.maxDelay&&(this.maxTimeout=setTimeout(this.exit,this.options.maxDelay))}get active(){return this._active}get destroyed(){return!!this.job}destroy(){this.job&&(this.job.stop(),this.clearTimeouts(),this.job=null,this._active=!1)}start(){this.job&&!this._active&&(this.jobComplete?this.restartTimeout=setTimeout(this.exit,this.options.restartDelay):this.job.start(),this._active=!0)}stop(){this.job&&this._active&&(this.clearRestartTimeout(),this._active=!1)}};function h(o,t={}){return new e(o,t)}export{h as exitHook};
