import { UniversalPHP } from '../../universal';
import { Logger } from '../logger';
/**
 * Collect PHP logs from the error_log file and log them.
 * @param UniversalPHP playground instance
 * @param loggerInstance The logger instance
 */
export declare const collectPhpLogs: (loggerInstance: Logger, playground: UniversalPHP) => void;
