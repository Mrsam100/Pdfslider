/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Production-grade Environment Configuration
 * Type-safe access to environment variables with validation
 */

export class EnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvironmentError';
  }
}

interface EnvironmentConfig {
  // API Configuration
  apiKey: string;
  apiEndpoint: string;
  apiTimeout: number;

  // Application Configuration
  appName: string;
  appVersion: string;
  environment: 'development' | 'production' | 'staging';

  // Feature Flags
  enableAnalytics: boolean;
  enableErrorTracking: boolean;
  enableRateLimiting: boolean;

  // Rate Limiting
  rateLimitWindow: number;
  rateLimitMaxRequests: number;

  // File Upload
  maxFileSize: number;
  allowedFileTypes: string[];

  // Logging
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enableConsoleLogging: boolean;
}

class EnvironmentService {
  private config: EnvironmentConfig;
  private isInitialized = false;

  constructor() {
    this.config = this.loadConfiguration();
    this.validateConfiguration();
    this.isInitialized = true;
  }

  /**
   * Load configuration from environment variables
   */
  private loadConfiguration(): EnvironmentConfig {
    const isDevelopment = import.meta.env.DEV;
    const isProduction = import.meta.env.PROD;

    return {
      // API Configuration
      apiKey: this.getEnvVar('VITE_API_KEY', ''),
      apiEndpoint: this.getEnvVar('VITE_API_ENDPOINT', 'https://generativelanguage.googleapis.com/v1beta/models'),
      apiTimeout: parseInt(this.getEnvVar('VITE_API_TIMEOUT', '30000')),

      // Application Configuration
      appName: this.getEnvVar('VITE_APP_NAME', 'PDFSlider'),
      appVersion: this.getEnvVar('VITE_APP_VERSION', '1.0.0'),
      environment: isProduction ? 'production' : isDevelopment ? 'development' : 'staging',

      // Feature Flags
      enableAnalytics: this.getBoolEnvVar('VITE_ENABLE_ANALYTICS', isProduction),
      enableErrorTracking: this.getBoolEnvVar('VITE_ENABLE_ERROR_TRACKING', isProduction),
      enableRateLimiting: this.getBoolEnvVar('VITE_ENABLE_RATE_LIMITING', true),

      // Rate Limiting
      rateLimitWindow: parseInt(this.getEnvVar('VITE_RATE_LIMIT_WINDOW', '60000')), // 1 minute
      rateLimitMaxRequests: parseInt(this.getEnvVar('VITE_RATE_LIMIT_MAX_REQUESTS', '10')),

      // File Upload
      maxFileSize: parseInt(this.getEnvVar('VITE_MAX_FILE_SIZE', String(50 * 1024 * 1024))), // 50MB
      allowedFileTypes: this.getEnvVar('VITE_ALLOWED_FILE_TYPES', 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document').split(','),

      // Logging
      logLevel: this.getEnvVar('VITE_LOG_LEVEL', isDevelopment ? 'debug' : 'info') as 'debug' | 'info' | 'warn' | 'error',
      enableConsoleLogging: this.getBoolEnvVar('VITE_ENABLE_CONSOLE_LOGGING', isDevelopment),
    };
  }

  /**
   * Get environment variable with fallback
   */
  private getEnvVar(key: string, defaultValue: string): string {
    // Check both process.env (Vite define) and import.meta.env
    const value = (process.env as any)[key] || import.meta.env[key];
    return value !== undefined && value !== '' ? value : defaultValue;
  }

  /**
   * Get boolean environment variable
   */
  private getBoolEnvVar(key: string, defaultValue: boolean): boolean {
    const value = this.getEnvVar(key, '');
    if (value === '') return defaultValue;
    return value === 'true' || value === '1';
  }

  /**
   * Validate required configuration
   */
  private validateConfiguration(): void {
    const errors: string[] = [];

    // In production, API key is required
    if (this.config.environment === 'production' && !this.config.apiKey) {
      errors.push('API_KEY is required in production environment');
    }

    // Validate rate limiting values
    if (this.config.rateLimitMaxRequests <= 0) {
      errors.push('VITE_RATE_LIMIT_MAX_REQUESTS must be greater than 0');
    }

    if (this.config.rateLimitWindow <= 0) {
      errors.push('VITE_RATE_LIMIT_WINDOW must be greater than 0');
    }

    // Validate file size
    if (this.config.maxFileSize <= 0) {
      errors.push('VITE_MAX_FILE_SIZE must be greater than 0');
    }

    if (errors.length > 0) {
      throw new EnvironmentError(
        `Environment configuration errors:\n${errors.map(e => `  - ${e}`).join('\n')}`
      );
    }
  }

  /**
   * Get full configuration
   */
  get(): EnvironmentConfig {
    if (!this.isInitialized) {
      throw new EnvironmentError('Environment service not initialized');
    }
    return { ...this.config };
  }

  /**
   * Get specific config value
   */
  getApiKey(): string {
    return this.config.apiKey;
  }

  getApiEndpoint(): string {
    return this.config.apiEndpoint;
  }

  getEnvironment(): 'development' | 'production' | 'staging' {
    return this.config.environment;
  }

  isProduction(): boolean {
    return this.config.environment === 'production';
  }

  isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(feature: keyof Pick<EnvironmentConfig, 'enableAnalytics' | 'enableErrorTracking' | 'enableRateLimiting'>): boolean {
    return this.config[feature];
  }

  /**
   * Get rate limit configuration
   */
  getRateLimitConfig(): { window: number; maxRequests: number } {
    return {
      window: this.config.rateLimitWindow,
      maxRequests: this.config.rateLimitMaxRequests,
    };
  }

  /**
   * Get file upload configuration
   */
  getFileUploadConfig(): { maxSize: number; allowedTypes: string[] } {
    return {
      maxSize: this.config.maxFileSize,
      allowedTypes: [...this.config.allowedFileTypes],
    };
  }

  /**
   * Print configuration summary (for debugging)
   */
  printSummary(): void {
    if (!this.isDevelopment()) return;

    console.log('=== Environment Configuration ===');
    console.log(`Environment: ${this.config.environment}`);
    console.log(`App: ${this.config.appName} v${this.config.appVersion}`);
    console.log(`API Endpoint: ${this.config.apiEndpoint}`);
    console.log(`API Key: ${this.config.apiKey ? '***configured***' : 'NOT SET'}`);
    console.log(`Analytics: ${this.config.enableAnalytics ? 'enabled' : 'disabled'}`);
    console.log(`Error Tracking: ${this.config.enableErrorTracking ? 'enabled' : 'disabled'}`);
    console.log(`Rate Limiting: ${this.config.enableRateLimiting ? 'enabled' : 'disabled'}`);
    console.log(`Log Level: ${this.config.logLevel}`);
    console.log('================================');
  }
}

export const env = new EnvironmentService();
export default env;
