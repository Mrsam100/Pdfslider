/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// Type declarations for pdf.js library with proper typing
interface PdfJsLib {
  GlobalWorkerOptions: {
    workerSrc: string;
  };
  getDocument: (params: { data: ArrayBuffer }) => {
    promise: Promise<PdfDocument>;
  };
}

interface PdfDocument {
  numPages: number;
  getPage: (pageNum: number) => Promise<PdfPage>;
}

interface PdfPage {
  getTextContent: () => Promise<PdfTextContent>;
}

interface PdfPageItem {
  str: string;
  [key: string]: any;
}

interface PdfTextContent {
  items: PdfPageItem[];
  [key: string]: any;
}

// Safely check for pdfjsLib availability
declare const pdfjsLib: PdfJsLib | undefined;

export const extractTextFromPdf = async (file: File): Promise<string> => {
  try {
    // Check if PDF.js library is loaded
    if (typeof pdfjsLib === 'undefined') {
      throw new Error('PDF.js library is not loaded. Please ensure the library is included in your page.');
    }

    // Configure PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    // Validate file size (max 50MB)
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`PDF file too large. Maximum size is 50MB, received ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    let arrayBuffer: ArrayBuffer;
    try {
      arrayBuffer = await file.arrayBuffer();
    } catch (error) {
      throw new Error("Failed to read PDF file. The file may be corrupted.");
    }

    let pdf;
    try {
      pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    } catch (error) {
      throw new Error("Failed to parse PDF. The file may be corrupted, encrypted, or not a valid PDF.");
    }

    if (!pdf || !pdf.numPages || pdf.numPages === 0) {
      throw new Error("PDF contains no pages");
    }

    let fullText = "";

    // Helper to prevent UI freezing
    const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));

    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent: PdfTextContent = await page.getTextContent();

        if (textContent && textContent.items && Array.isArray(textContent.items)) {
          const pageText = textContent.items
            .filter((item: PdfPageItem) => item && typeof item.str === 'string')
            .map((item: PdfPageItem) => item.str)
            .join(" ");
          fullText += pageText + "\n\n";
        }

        // Yield to main thread every 2 pages to keep UI smooth
        if (i % 2 === 0) await nextFrame();
      } catch (pageError) {
        console.warn(`Failed to extract text from page ${i}:`, pageError);
        // Continue with other pages even if one fails
        fullText += `\n[Page ${i}: Text extraction failed]\n\n`;
      }
    }

    if (!fullText.trim()) {
      throw new Error("PDF appears to be empty or contains no extractable text. It may be image-based.");
    }

    return fullText;
  } catch (error) {
    // Re-throw with proper error context
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred while processing PDF");
  }
};

/**
 * Extract text from PDF page-by-page
 * Returns an array of page texts
 */
export const extractTextFromPdfPages = async (file: File): Promise<string[]> => {
  try {
    // Check if PDF.js library is loaded
    if (typeof pdfjsLib === 'undefined') {
      throw new Error('PDF.js library is not loaded. Please ensure the library is included in your page.');
    }

    // Configure PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    // Validate file size (max 50MB)
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`PDF file too large. Maximum size is 50MB, received ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    let arrayBuffer: ArrayBuffer;
    try {
      arrayBuffer = await file.arrayBuffer();
    } catch (error) {
      throw new Error("Failed to read PDF file. The file may be corrupted.");
    }

    let pdf;
    try {
      pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    } catch (error) {
      throw new Error("Failed to parse PDF. The file may be corrupted, encrypted, or not a valid PDF.");
    }

    if (!pdf || !pdf.numPages || pdf.numPages === 0) {
      throw new Error("PDF contains no pages");
    }

    const pages: string[] = [];

    // Helper to prevent UI freezing
    const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));

    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent: PdfTextContent = await page.getTextContent();

        if (textContent && textContent.items && Array.isArray(textContent.items)) {
          const pageText = textContent.items
            .filter((item: PdfPageItem) => item && typeof item.str === 'string')
            .map((item: PdfPageItem) => item.str)
            .join(" ");
          pages.push(pageText);
        } else {
          pages.push(""); // Empty page
        }

        // Yield to main thread every 2 pages to keep UI smooth
        if (i % 2 === 0) await nextFrame();
      } catch (pageError) {
        console.warn(`Failed to extract text from page ${i}:`, pageError);
        pages.push(`[Page ${i}: Text extraction failed]`);
      }
    }

    return pages;
  } catch (error) {
    // Re-throw with proper error context
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred while processing PDF");
  }
};