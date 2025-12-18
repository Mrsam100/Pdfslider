/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// Type declarations for mammoth library
declare const mammoth: any;

interface MammothResult {
  value: string;
  messages: any[];
}

export const extractTextFromDocx = async (file: File): Promise<string> => {
  try {
    // Validate file size (max 50MB)
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`DOCX file too large. Maximum size is 50MB, received ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    let arrayBuffer: ArrayBuffer;
    try {
      arrayBuffer = await file.arrayBuffer();
    } catch (error) {
      throw new Error("Failed to read DOCX file. The file may be corrupted.");
    }

    let result: MammothResult;
    try {
      result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    } catch (error) {
      console.error("DOCX Extraction Error:", error);
      throw new Error("Failed to parse DOCX file. It might be corrupted, protected, or not a valid DOCX document.");
    }

    // Validate result structure
    if (!result || typeof result.value !== 'string') {
      throw new Error("DOCX extraction returned invalid data");
    }

    // Check if document is empty
    if (!result.value.trim()) {
      throw new Error("DOCX file appears to be empty or contains no extractable text");
    }

    // Log warnings if any
    if (result.messages && result.messages.length > 0) {
      console.warn("DOCX extraction warnings:", result.messages);
    }

    return result.value;
  } catch (error) {
    // Re-throw with proper error context
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred while processing DOCX file");
  }
};
