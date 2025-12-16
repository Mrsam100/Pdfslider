
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

declare const mammoth: any;

export const extractTextFromDocx = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    return result.value; // The raw text
  } catch (error) {
    console.error("DOCX Extraction Error:", error);
    throw new Error("Failed to read the DOCX file. It might be corrupted or protected.");
  }
};
