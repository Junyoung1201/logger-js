"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
exports.ensureDir = ensureDir;
var fs_1 = require("fs");
var path = require("path");
function ensureDir(dirPath) {
    return __awaiter(this, void 0, void 0, function () {
        var resolvedPath;
        return __generator(this, function (_a) {
            try {
                resolvedPath = path.resolve(dirPath);
                (0, fs_1.mkdirSync)(resolvedPath, { recursive: true });
            }
            catch (err) {
                console.error("\uB514\uB809\uD130\uB9AC \uC0DD\uC131 \uC2E4\uD328: ".concat(dirPath), err);
                throw err;
            }
            return [2 /*return*/];
        });
    });
}
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.obj2str = function (value) {
        if (value === null)
            return 'null';
        if (value === undefined)
            return 'undefined';
        if (value instanceof Error) {
            return "".concat(value.name, ": ").concat(value.message, "\n").concat(value.stack);
        }
        if (typeof value === 'object') {
            try {
                return JSON.stringify(value, null, 4);
            }
            catch (err) {
                return '[Object with circular reference]';
            }
        }
        return value.toString();
    };
    Logger.getTimeStr = function (date) {
        var yyyy = date.getFullYear().toString().padEnd(4, "0");
        var mm = (date.getMonth() + 1).toString().padStart(2, "0");
        var dd = date.getDate().toString().padStart(2, "0");
        var h = date.getHours().toString().padStart(2, "0");
        var m = date.getMinutes().toString().padStart(2, "0");
        var s = date.getSeconds().toString().padStart(2, "0");
        return {
            yyyy: yyyy,
            mm: mm,
            dd: dd,
            h: h,
            m: m,
            s: s
        };
    };
    Logger.setSilent = function (bool) {
        Logger.silent = bool;
        Logger.s("Logger.silent = ".concat(bool));
    };
    Logger.getLogFileFullPath = function () {
        var _a;
        return path.resolve(Logger.logDir, (_a = Logger.logFileName) !== null && _a !== void 0 ? _a : Logger.createDefaultLogFileName());
    };
    Logger.createDefaultLogFileName = function () {
        var _a = Logger.getTimeStr(new Date()), yyyy = _a.yyyy, mm = _a.mm, dd = _a.dd, h = _a.h, m = _a.m, s = _a.s;
        return "".concat(yyyy).concat(mm).concat(dd, " ").concat(h).concat(m).concat(s, ".log");
    };
    Logger.startWriteLogFile = function (fileOrDir) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (fileOrDir !== undefined) {
                    // 경로가 로그 파일이 아닐 경우 -> logSaveDir 설정
                    if (!fileOrDir.endsWith(".log")) {
                        Logger.logDir = fileOrDir;
                        if (Logger.logFileName === undefined) {
                            Logger.logFileName = Logger.createDefaultLogFileName();
                        }
                    }
                    // 경로가 로그 파일일 경우 -> logSaveDir, logFile 설정
                    else {
                        Logger.logFileName = path.basename(fileOrDir);
                        Logger.logDir = fileOrDir.slice(0, fileOrDir.length - Logger.logFileName.length);
                    }
                }
                Logger.s("Start writing log file: ".concat(Logger.getLogFileFullPath(), " (logFileName = \"").concat(Logger.logFileName, "\", logDir = \"").concat(Logger.logDir, "\")"));
                if (!Logger.logFileName) {
                    Logger.logFileName = Logger.createDefaultLogFileName();
                }
                if (!Logger.ws) {
                    try {
                        ensureDir(Logger.logDir);
                    }
                    catch (err) {
                        console.error("An error occurred while creating a folder to ensure log file paths.");
                        console.error(err);
                    }
                    try {
                        Logger.ws = (0, fs_1.createWriteStream)(Logger.getLogFileFullPath(), { flags: 'w', encoding: 'utf-8' });
                    }
                    catch (err) {
                        console.error("An error occurred while creating a write stream to write a log file.");
                        console.error(err);
                    }
                }
                Logger.paused = false;
                return [2 /*return*/];
            });
        });
    };
    Logger.writeLogFile = function (line) {
        var _a;
        if (!Logger.paused && Logger.ws) {
            (_a = Logger.ws) === null || _a === void 0 ? void 0 : _a.write(line + "\n");
        }
    };
    Logger.s = function (message) {
        if (!Logger.silent) {
            console.log(message);
        }
    };
    Logger.stopWriteLogFile = function () {
        Logger.s("Stop writing log file.");
        if (Logger.ws) {
            Logger.s("A write stream of log files currently exists. Ends the write stream of a log file.");
            Logger.ws.close();
            Logger.ws.end();
            Logger.ws = undefined;
        }
    };
    Logger.pauseWriteLogFile = function (bool) {
        Logger.paused = bool;
        if (!Logger.paused && !Logger.ws) {
            Logger.s('Log file recording is enabled, but the write stream for the log file does not exist. call startWriteLogFile.');
            Logger.startWriteLogFile();
        }
    };
    Logger.setLogSaveDir = function (dir) {
        Logger.logDir = dir;
        Logger.s("Logger.logDir = \"".concat(dir, "\""));
        if (Logger.ws) {
            Logger.stopWriteLogFile();
            Logger.startWriteLogFile();
        }
    };
    Logger.getLogSaveDir = function () {
        return Logger.logDir;
    };
    Logger.setLogFile = function (file) {
        if (Logger.logFileName === file) {
            return;
        }
        Logger.logFileName = file + (file.endsWith(".log") ? "" : ".log");
        Logger.s("Logger.logFileName = \"".concat(file, "\""));
        if (Logger.ws) {
            Logger.stopWriteLogFile();
            Logger.startWriteLogFile();
        }
    };
    Logger.info = function (message) {
        Logger.log('info', message);
    };
    Logger.log = function (level, message) {
        var _a = Logger.getTimeStr(new Date()), yyyy = _a.yyyy, mm = _a.mm, dd = _a.dd, h = _a.h, m = _a.m, s = _a.s;
        var text = "[".concat(yyyy, "-").concat(mm, "-").concat(dd, " ").concat(h, ":").concat(m, ":").concat(s, "] [").concat(level.toUpperCase(), "] ").concat(message);
        console[level](text);
        Logger.writeLogFile(text);
    };
    Logger.warn = function (message) {
        Logger.log('warn', message);
    };
    Logger.error = function (message) {
        Logger.log('error', message);
    };
    Logger.logDir = __dirname;
    Logger.logFileName = undefined;
    Logger.paused = false;
    Logger.silent = true;
    Logger.ws = undefined;
    return Logger;
}());
exports.Logger = Logger;
process.on('SIGINT', function () {
    Logger.stopWriteLogFile();
});
