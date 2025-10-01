import { LoggerService } from '@nestjs/common';
import chalk from 'chalk';

export class CustomLogger implements LoggerService {
  log(message: any, context?: string) {
    if (context === 'RouterExplorer') return; // chặn log của RouterExplorer
    console.log(chalk.green(`[LOG] ${context ?? ''} - ${message}`));
  }
  error(message: any, trace?: string, context?: string) {
    console.error(chalk.red(`[ERROR] ${context ?? ''} - ${message}`));
  }
  warn(message: any, context?: string) {
    console.warn(chalk.yellow(`[WARN] ${context ?? ''} - ${message}`));
  }
  debug?(message: any, context?: string) {
    console.debug(chalk.blue(`[DEBUG] ${context ?? ''} - ${message}`));
  }
  verbose?(message: any, context?: string) {
    console.info(chalk.magenta(`[VERBOSE] ${context ?? ''} - ${message}`));
  }
}
