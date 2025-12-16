/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

declare const pdfjsLib: any;

export const extractTextFromPdf = async (file: File): Promise<string> => {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  // Helper to prevent UI freezing
  const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(" ");
    fullText += pageText + "\n\n";
    
    // Yield to main thread every 2 pages to keep UI smooth
    if (i % 2 === 0) await nextFrame();
  }

  return fullText;
};