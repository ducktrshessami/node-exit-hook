# node-exit-hook
A utility module for dynamic scheduled exits

Intended to be a flexible replacement for cron-based scheduled exits

# Usage

```js
const { exitHook } = require("exit-hook");

const exit = exitHook("0 0 * * *");

// Become busy
exit.stop();

// 00:00 passes
// Become free
exit.start(); // Process exits
```

### Hook Options
All options are optional

```js
const { exitHook } = require("exit-hook");

exitHook("0 0 * * *", {
    restartDelay: 300_000,
    maxDelay: 3_600_000,
    active: false,
    beforeExit: () => console.log("Cleanup!"),
    exitCode: 0,
    errorExitCode: 1
});
```

#### restartDelay: number
A delay (in milliseconds) after restarting the hook before the process exits

Only applied if the cron schedule has already passed upon calling `ExitHook#start()`

Defaults to `0`

#### maxDelay: number
The max time (in milliseconds) to delay exiting after the cron schedule has already passed

Applied even when stopped but not when destroyed

If `undefined`, the delay will be unlimited

Defaults to `undefined`

#### active: boolean
Whether the cron schedule should be active upon creation

Defaults to `true`

#### beforeExit: Function
A function to execute just before the process exits

Intended for graceful cleanup

The [maxDelay](#maxdelay-number) option is **not** applied to the duration of this function's execution

Defaults to `undefined`

#### exitCode: number
The status code to exit with

Defaults to `0`

#### errorExitCode: number
The status code to exit with if the [beforeExit](#beforeexit-function) function errors

Defaults to `1`
