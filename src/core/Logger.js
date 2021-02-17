import { readFileSync } from 'fs';
import { resolve } from 'path';

const DATE_FORMAT = 'DD-MM-YYYY-hh:mm:ss.SSS';

const colors = {
  reset: '\x1b[0m',
  fg: {
    magenta: '\x1b[35m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    cyan: '\x1b[36m',
    warn: '\x1b[33m',
    white: '\x1b[37m',
  },
  bg: {
    magenta: '\x1b[45m',
    blue: '\x1b[44m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    cyan: '\x1b[46m',
    warn: '\x1b[43m',
    white: '\x1b[47m',
  },
};

const mapping = {
  assert: [colors.fg.magenta, colors.bg.magenta],
  debug: [colors.fg.blue, colors.bg.blue],
  error: [colors.fg.red, colors.bg.red],
  info: [colors.fg.green, colors.bg.green],
  trace: [colors.fg.cyan, colors.bg.cyan],
  warn: [colors.fg.warn, colors.bg.warn],
};

class Logger {
  constructor(isProduction) {
    this.isProduction = isProduction;

    const packageJsonPath = resolve(process.cwd(), 'package.json');

    this.packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8').toString());
  }

  overrideConsole(methodName, ...args) {
    const date = new Date();

    const getDate = () =>
      DATE_FORMAT.replace('DD', date.getDate().toString().padStart(2, '0'))
        .replace('MM', (date.getMonth() + 1).toString().padStart(2, '0'))
        .replace('YYYY', date.getFullYear().toString().padStart(4, '0'))
        .replace('hh', date.getHours().toString().padStart(2, '0'))
        .replace('mm', date.getMinutes().toString().padStart(2, '0'))
        .replace('ss', date.getSeconds().toString().padStart(2, '0'))
        .replace('SSS', date.getMilliseconds().toString().padStart(3, '0'));

    const [fg, bg] = mapping[methodName];

    const prefix = `${fg}[${this.packageJson.name}] ${getDate()} ${bg}${colors.fg.white}${methodName.toUpperCase()}${colors.reset}`;

    if (this.isProduction && !['error', 'warn'].includes(methodName)) {
      return;
    }

    console.log.apply(console, [
      prefix,
      ...args.map((arg) => {
        if (arg instanceof Error) throw arg;

        return `${typeof arg === 'string' ? arg : JSON.stringify(arg)}`;
      }),
    ]);
  }

  log(...args) {
    this.overrideConsole('info', ...args);
  }

  assert(...args) {
    this.overrideConsole('assert', ...args);
  }

  debug(...args) {
    this.overrideConsole('debug', ...args);
  }

  info(...args) {
    this.overrideConsole('info', ...args);
  }

  trace(...args) {
    this.overrideConsole('trace', ...args);
  }

  warn(...args) {
    this.overrideConsole('warn', ...args);
  }

  error(...args) {
    this.overrideConsole('error', ...args);
  }
}

export default Logger;
