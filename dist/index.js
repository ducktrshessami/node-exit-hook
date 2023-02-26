"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exitHook = void 0;
const ExitHook_1 = __importDefault(require("./ExitHook"));
function exitHook(cronExpression, options = {}) {
    return new ExitHook_1.default(cronExpression, options);
}
exports.exitHook = exitHook;
