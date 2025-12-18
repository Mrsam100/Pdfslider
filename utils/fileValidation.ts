/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * File Validation Utilities
 * Uses magic numbers (file signatures) for accurate file type detection
 */

interface FileSignature {
  signature: number[];
  offset: number;
  type: string;
}

// File signatures (magic numbers) for accurate file type detection
const FILE_SIGNATURES: Record<string, FileSignature[]> = {
  pdf: [
    { signature: [0x25, 0x50, 0x44, 0x46], offset: 0, type: 'application/pdf' }, // %PDF
  ],
  docx: [
    // DOCX files are ZIP archives with specific internal structure
    { signature: [0x50, 0x4B, 0x03, 0x04], offset: 0, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }, // PK.. (ZIP)
    { signature: [0x50, 0x4B, 0x05, 0x06], offset: 0, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }, // PK.. (ZIP empty)
  ],
  zip: [
    { signature: [0x50, 0x4B, 0x03, 0x04], offset: 0, type: 'application/zip' },
    { signature: [0x50, 0x4B, 0x05, 0x06], offset: 0, type: 'application/zip' },
  ],
};

/**
 * Check if bytes match a signature at given offset
 */
const matchesSignature = (bytes: Uint8Array, signature: FileSignature): boolean => {
  const { signature: sig, offset } = signature;

  if (bytes.length < offset + sig.length) {
    return false;
  }

  for (let i = 0; i < sig.length; i++) {
    if (bytes[offset + i] !== sig[i]) {
      return false;
    }
  }

  return true;
};

/**
 * Validate file using magic numbers (file signatures)
 * More reliable than MIME type or extension checking
 */
export const validateFileSignature = async (file: File, expectedType: 'pdf' | 'docx'): Promise<boolean> => {
  try {
    // Read first 8KB of file (enough for signature checking)
    const slice = file.slice(0, 8192);
    const arrayBuffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    const signatures = FILE_SIGNATURES[expectedType];
    if (!signatures) {
      return false;
    }

    // Check if any signature matches
    for (const signature of signatures) {
      if (matchesSignature(bytes, signature)) {
        // For DOCX, verify it's actually a DOCX and not just any ZIP
        if (expectedType === 'docx') {
          return await verifyDocxStructure(file);
        }
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('File signature validation error:', error);
    return false;
  }
};

/**
 * Verify DOCX file structure (check for required XML files inside ZIP)
 */
const verifyDocxStructure = async (file: File): Promise<boolean> => {
  try {
    // Read more of the file to check internal structure
    const slice = file.slice(0, 65536); // 64KB should be enough
    const arrayBuffer = await slice.arrayBuffer();
    const text = new TextDecoder().decode(arrayBuffer);

    // DOCX files must contain these markers
    const requiredMarkers = [
      'word/document.xml',      // Main document
      '[Content_Types].xml',    // Content types definition
    ];

    // Check if at least one required marker exists
    return requiredMarkers.some(marker => text.includes(marker));
  } catch (error) {
    console.error('DOCX structure verification error:', error);
    return false;
  }
};

/**
 * Comprehensive file validation
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
  warnings?: string[];
}

export const validateFile = async (file: File, expectedType: 'pdf' | 'docx'): Promise<FileValidationResult> => {
  const warnings: string[] = [];

  // 1. Check file exists
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // 2. Check file size
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }
  if (file.size < 100) {
    return { valid: false, error: 'File is too small to be a valid document' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size is 50MB.`,
    };
  }

  // 3. Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension !== expectedType) {
    return {
      valid: false,
      error: `Invalid file extension: .${extension}. Expected .${expectedType}`,
    };
  }

  // 4. Check MIME type
  const validMimeTypes: Record<string, string[]> = {
    pdf: ['application/pdf'],
    docx: [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip', // DOCX is a ZIP file
    ],
  };

  if (!validMimeTypes[expectedType].includes(file.type)) {
    warnings.push(`MIME type mismatch: ${file.type}. Expected ${validMimeTypes[expectedType][0]}`);
  }

  // 5. Validate file signature (magic numbers)
  const signatureValid = await validateFileSignature(file, expectedType);
  if (!signatureValid) {
    return {
      valid: false,
      error: `File signature validation failed. This may not be a valid ${expectedType.toUpperCase()} file.`,
    };
  }

  return {
    valid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
};

/**
 * Sanitize filename to prevent directory traversal attacks
 */
export const sanitizeFilename = (filename: string): string => {
  // Remove path separators and dangerous characters
  return filename
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .replace(/^\.+/, '') // Remove leading dots
    .substring(0, 255); // Limit length
};

/**
 * Check if file might contain malicious content
 */
export const checkForSuspiciousContent = async (file: File): Promise<{ safe: boolean; reason?: string }> => {
  try {
    // Read first 64KB
    const slice = file.slice(0, 65536);
    const arrayBuffer = await slice.arrayBuffer();
    const text = new TextDecoder('utf-8', { fatal: false }).decode(arrayBuffer);

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /onerror=/i,
      /onclick=/i,
      /eval\(/i,
      /%3Cscript/i, // URL encoded script tag
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(text)) {
        return {
          safe: false,
          reason: 'File contains potentially malicious content',
        };
      }
    }

    return { safe: true };
  } catch (error) {
    console.error('Suspicious content check error:', error);
    // If we can't check, assume safe but log warning
    console.warn('Could not complete security scan of file');
    return { safe: true };
  }
};
