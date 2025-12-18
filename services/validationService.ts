/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Production-grade Input Validation Service
 * Prevents XSS, SQL injection, and other security vulnerabilities
 */

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class ValidationService {
  /**
   * Sanitize HTML to prevent XSS attacks
   */
  sanitizeHTML(input: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };
    return input.replace(/[&<>"'/]/g, (char) => map[char] || char);
  }

  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  /**
   * Validate password strength
   */
  isValidPassword(password: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 12) {
      errors.push('Password must be at least 12 characters long');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate file upload
   */
  validateFile(file: File, options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}): { valid: boolean; error?: string } {
    const {
      maxSize = 50 * 1024 * 1024, // 50MB default
      allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      allowedExtensions = ['pdf', 'docx']
    } = options;

    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`
      };
    }

    // Check minimum file size (avoid empty files)
    if (file.size < 100) {
      return {
        valid: false,
        error: 'File appears to be empty or corrupted'
      };
    }

    // Check MIME type
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`
      };
    }

    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !allowedExtensions.includes(extension)) {
      return {
        valid: false,
        error: `Invalid file extension. Allowed extensions: ${allowedExtensions.join(', ')}`
      };
    }

    return { valid: true };
  }

  /**
   * Validate string input
   */
  validateString(
    input: string,
    options: {
      minLength?: number;
      maxLength?: number;
      pattern?: RegExp;
      required?: boolean;
    } = {}
  ): { valid: boolean; error?: string } {
    const {
      minLength = 0,
      maxLength = 10000,
      pattern,
      required = false
    } = options;

    if (required && (!input || input.trim().length === 0)) {
      return { valid: false, error: 'This field is required' };
    }

    if (input && input.length < minLength) {
      return { valid: false, error: `Minimum length is ${minLength} characters` };
    }

    if (input && input.length > maxLength) {
      return { valid: false, error: `Maximum length is ${maxLength} characters` };
    }

    if (pattern && !pattern.test(input)) {
      return { valid: false, error: 'Invalid format' };
    }

    return { valid: true };
  }

  /**
   * Sanitize filename
   */
  sanitizeFilename(filename: string): string {
    // Remove dangerous characters
    return filename
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/\.{2,}/g, '.') // Prevent directory traversal
      .substring(0, 255); // Limit length
  }

  /**
   * Check for SQL injection patterns
   */
  hasSQLInjectionPattern(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
      /(--|;|\/\*|\*\/)/,
      /(\bOR\b.*=.*)/i,
      /(\bAND\b.*=.*)/i,
      /(\bUNION\b.*\bSELECT\b)/i
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Validate JSON input
   */
  isValidJSON(input: string): boolean {
    try {
      JSON.parse(input);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Rate limit validation (check if action is allowed)
   */
  checkActionRateLimit(
    userId: string,
    action: string,
    limit: number,
    windowMs: number
  ): boolean {
    const key = `${userId}-${action}`;
    const now = Date.now();
    const timestamps = this.getRateLimitData(key);

    // Remove old timestamps
    const validTimestamps = timestamps.filter(t => t > now - windowMs);

    if (validTimestamps.length >= limit) {
      return false;
    }

    validTimestamps.push(now);
    this.setRateLimitData(key, validTimestamps);
    return true;
  }

  private rateLimitStore = new Map<string, number[]>();

  private getRateLimitData(key: string): number[] {
    return this.rateLimitStore.get(key) || [];
  }

  private setRateLimitData(key: string, data: number[]): void {
    this.rateLimitStore.set(key, data);
  }
}

export const validationService = new ValidationService();
export default validationService;
