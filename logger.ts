import { WriteStream, createWriteStream, mkdirSync } from 'fs';
import * as path from 'path';

export async function ensureDir(dirPath: string): Promise<void> {
    try {
        const resolvedPath = path.resolve(dirPath);
        mkdirSync(resolvedPath, { recursive: true });
    } catch (err: any) {
        console.error(`디렉터리 생성 실패: ${dirPath}`, err);
        throw err;
    }
}

export class Logger {
    private static logDir = __dirname;
    private static logFileName: string | undefined = undefined;
    private static paused: boolean = false;
    private static silent: boolean = true;
    private static ws: WriteStream | undefined = undefined;

    static obj2str(value: any): string {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';

        if (value instanceof Error) {
            return `${value.name}: ${value.message}\n${value.stack}`;
        }

        if (typeof value === 'object') {
            try {
                return JSON.stringify(value, null, 4);
            } catch (err) {
                return '[Object with circular reference]';
            }
        }

        return value.toString();
    }

    static getTimeStr(date: Date) {
        let yyyy = date.getFullYear().toString().padEnd(4, "0")
        let mm = (date.getMonth() + 1).toString().padStart(2, "0")
        let dd = date.getDate().toString().padStart(2, "0")
        let h = date.getHours().toString().padStart(2, "0")
        let m = date.getMinutes().toString().padStart(2, "0")
        let s = date.getSeconds().toString().padStart(2, "0")

        return {
            yyyy, mm, dd, h, m, s
        }
    }

    static setSilent(bool: boolean) {
        Logger.silent = bool;
        Logger.s(`Logger.silent = ${bool}`)
    }

    static getLogFileFullPath() {
        return path.resolve(Logger.logDir, Logger.logFileName ?? Logger.createDefaultLogFileName());
    }

    private static createDefaultLogFileName() {
        const { yyyy, mm, dd, h, m, s } = Logger.getTimeStr(new Date());
        return `${yyyy}${mm}${dd} ${h}${m}${s}.log`;
    }

    static async startWriteLogFile(fileOrDir?: string) {
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

        Logger.s(`Start writing log file: ${Logger.getLogFileFullPath()} (logFileName = "${Logger.logFileName}", logDir = "${Logger.logDir}")`)

        if (!Logger.logFileName) {
            Logger.logFileName = Logger.createDefaultLogFileName();
        }
        if (!Logger.ws) {
            try {
                ensureDir(Logger.logDir);
            } catch (err) {
                console.error(`An error occurred while creating a folder to ensure log file paths.`);
                console.error(err);
            }

            try {
                Logger.ws = createWriteStream(Logger.getLogFileFullPath(), { flags: 'w', encoding: 'utf-8' });
            } catch (err) {
                console.error(`An error occurred while creating a write stream to write a log file.`)
                console.error(err);
            }
        }
        Logger.paused = false;
    }

    private static writeLogFile(line: string) {
        if (!Logger.paused && Logger.ws) {
            Logger.ws?.write(line + "\n");
        }
    }

    private static s(message: string) {
        if (!Logger.silent) {
            console.log(message);
        }
    }

    static stopWriteLogFile() {
        if (!Logger.ws) {
            return;
        }

        Logger.s(`Stop writing log file.`);

        Logger.s(`A write stream of log files currently exists. Ends the write stream of a log file.`);
        Logger.ws.close();
        Logger.ws.end();
        Logger.ws = undefined;
    }

    static pauseWriteLogFile(bool: boolean) {
        Logger.paused = bool;

        if (!Logger.paused && !Logger.ws) {
            Logger.s('Log file recording is enabled, but the write stream for the log file does not exist. call startWriteLogFile.');
            Logger.startWriteLogFile();
        }
    }

    static setLogSaveDir(dir: string) {
        Logger.logDir = dir;
        Logger.s(`Logger.logDir = "${dir}"`);

        if (Logger.ws) {
            Logger.stopWriteLogFile();
            Logger.startWriteLogFile();
        }
    }

    static getLogSaveDir() {
        return Logger.logDir;
    }

    static setLogFile(file: string) {
        if (Logger.logFileName === file) {
            return;
        }

        Logger.logFileName = file + (file.endsWith(".log") ? "" : ".log");
        Logger.s(`Logger.logFileName = "${file}"`);

        if (Logger.ws) {
            Logger.stopWriteLogFile();
            Logger.startWriteLogFile();
        }
    }

    static log(level: 'warn' | 'error' | 'info', message: string) {
        const { yyyy, mm, dd, h, m, s } = Logger.getTimeStr(new Date());
        const text = `[${yyyy}-${mm}-${dd} ${h}:${m}:${s}] [${level.toUpperCase()}] ${message}`;
        console[level](text);
        Logger.writeLogFile(text);
    }

    static info(message: string) {
        Logger.log('info', message)
    }

    static warn(message: string) {
        Logger.log('warn', message)
    }

    static error(message: string) {
        Logger.log('error', message)
    }
}

export class ExpressLogger {
    routePrefix: string;
    ipPrefix: string;

    constructor(req: any) {
        const method = (req.method as string).toUpperCase();
        const route = req.baseUrl || req.path || "/";

        this.routePrefix = `[${method} ${route}]`;
        this.ipPrefix = `[IP: ${req.ip}]`;
    }

    private formatMessage(message: string, obj?: any): string {
        let fullMessage = `${this.routePrefix} ${this.ipPrefix} ${message}`;
        if (obj !== undefined) {
            fullMessage += ` ${Logger.obj2str(obj)}`;
        }
        return fullMessage;
    }

    info(message: string, obj?: any) {
        Logger.info(this.formatMessage(message, obj));
    }

    error(message: string, obj?: any) {
        Logger.error(this.formatMessage(message, obj));
    }

    warn(message: string, obj?: any) {
        Logger.warn(this.formatMessage(message, obj));
    }
}

process.on('SIGINT', () => {
    Logger.stopWriteLogFile();
    process.exit(0);
})

