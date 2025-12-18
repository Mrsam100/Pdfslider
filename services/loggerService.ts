/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Production-grade Logging Service
 * Centralized logging with levels, formatting, and error tracking
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  stack?: string;
  userId?: string;
}

class LoggerService {
  private isDevelopment = import.meta.env.DEV;
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory

  /**
   * Log debug message
   */
  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      this.log('debug', message, data);
    }
  }

  /**
   * Log info message
   */
  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  /**
   * Log warning
   */
  warn(message: string, data?: any): void {
    this.log('warn', message, data);
    console.warn(`[WARN] ${message}`, data);
  }

  /**
   * Log error
   */
  error(message: string, error?: Error | any, data?: any): void {
    const stack = error instanceof Error ? error.stack : undefined;
    this.log('error', message, { ...data, error: error?.message }, stack);
    console.error(`[ERROR] ${message}`, error, data);

    // In production, send to error tracking service
    if (!this.isDevelopment) {
      this.sendToErrorTracking({ message, error, data });
    }
  }

  /**
   * Internal logging method
   */
  private log(level: LogLevel, message: string, data?: any, stack?: string): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      stack,
      userId: this.getCurrentUserId()
    };

    this.logs.push(entry);

    // Maintain max logs limit
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output in development
    if (this.isDevelopment) {
      const prefix = `[${level.toUpperCase()}] ${entry.timestamp}`;
      console.log(prefix, message, data || '');
    }
  }

  /**
   * Get current user ID from localStorage
   */
  private getCurrentUserId(): string | undefined {
    try {
      return localStorage.getItem('pdfslider_user') || undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Send error to tracking service (implement your service here)
   */
  private sendToErrorTracking(errorData: any): void {
    // TODO: Integrate with Sentry, LogRocket, or similar service
    // Example:
    // Sentry.captureException(errorData.error, {
    //   extra: errorData.data,
    //   tags: { userId: this.getCurrentUserId() }
    // });
  }

  /**
   * Get recent logs
   */
  getRecentLogs(count: number = 100): LogEntry[] {
    return this.logs.slice(-count);
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Performance tracking
   */
  startTimer(label: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.info(`Performance: ${label}`, { duration: `${duration.toFixed(2)}ms` });
    };
  }

  /**
   * Track API call
   */
  trackAPICall(endpoint: string, method: string, duration: number, status: number): void {
    this.info(`API Call: ${method} ${endpoint}`, {
      duration: `${duration.toFixed(2)}ms`,
      status
    });
  }

  /**
   * Track user action
   */
  trackUserAction(action: string, data?: any): void {
    this.info(`User Action: ${action}`, data);
  }
}

export const logger = new LoggerService();
export default logger;
