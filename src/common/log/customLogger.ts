import { LoggerService } from '@nestjs/common';

type LogMessage = string | Record<string, unknown> | Error;

export class CustomLogger implements LoggerService {
  private readonly colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    gray: '\x1b[90m',
  };

  private formatMessage(message: LogMessage): string {
    if (typeof message === 'string') return message;
    if (message instanceof Error) return message.stack ?? message.message;
    return JSON.stringify(message, null, 2);
  }

  log(message: LogMessage, context?: string) {
    if (context === 'RouterExplorer' || context === 'InstanceLoader') return;
    console.log(
      `${this.colors.green}[LOG]${this.colors.reset} ${context ?? ''} - ${this.formatMessage(message)}`,
    );
  }

  error(message: LogMessage, trace?: string, context?: string) {
    console.error(
      `${this.colors.red}[ERROR]${this.colors.reset} ${context ?? ''} - ${this.formatMessage(message)}`,
    );
    if (trace) console.error(`${this.colors.gray}${trace}${this.colors.reset}`);
  }

  warn(message: LogMessage, context?: string) {
    console.warn(
      `${this.colors.yellow}[WARN]${this.colors.reset} ${context ?? ''} - ${this.formatMessage(message)}`,
    );
  }

  debug?(message: LogMessage, context?: string) {
    console.debug(
      `${this.colors.blue}[DEBUG]${this.colors.reset} ${context ?? ''} - ${this.formatMessage(message)}`,
    );
  }

  verbose?(message: LogMessage, context?: string) {
    console.info(
      `${this.colors.magenta}[VERBOSE]${this.colors.reset} ${context ?? ''} - ${this.formatMessage(message)}`,
    );
  }
}
