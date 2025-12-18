/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// Type declarations for PptxGenJS library
declare const PptxGenJS: any;
import { SlideData } from '../types';

interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  font: string;
  chartColors: string[];
}

// Sanitize color values to prevent injection
const sanitizeColor = (color: string): string => {
  // Only allow 6-digit hex colors (without #)
  return color.replace(/[^0-9A-Fa-f]/g, '').substring(0, 6);
};

// Sanitize text prompts for URL construction
const sanitizePrompt = (prompt: string): string => {
  // Remove potentially dangerous characters and limit length
  return prompt
    .replace(/[<>\"'&]/g, '') // Remove HTML/script special chars
    .replace(/[\r\n\t]/g, ' ') // Replace newlines/tabs with spaces
    .trim()
    .substring(0, 500); // Limit length to 500 chars
};

const THEMES: Record<string, ThemeConfig> = {
  executive: {
    primary: '0F172A', // Slate
    secondary: 'F8FAFC', // White
    accent: '4F46E5', // Indigo
    text: '334155',
    font: 'Arial',
    chartColors: ['4F46E5', '10B981', 'F59E0B']
  },
  creative: {
    primary: '4C1D95', // Deep Purple
    secondary: 'FAF5FF', // Light Purple
    accent: 'D946EF', // Fuschia
    text: '2D0A31',
    font: 'Georgia',
    chartColors: ['D946EF', '8B5CF6', '06B6D4']
  },
  minimal: {
    primary: '000000', // Black
    secondary: 'FFFFFF', // White
    accent: '525252', // Gray
    text: '171717',
    font: 'Courier New',
    chartColors: ['171717', '737373', 'A3A3A3']
  }
};

export const generatePptx = async (slides: SlideData[], fileName: string, themeName: 'executive' | 'creative' | 'minimal' = 'executive') => {
  // Check if PptxGenJS is loaded
  if (typeof PptxGenJS === 'undefined') {
    throw new Error('PptxGenJS library not loaded. Please refresh the page and try again.');
  }

  // Validate inputs
  if (!slides || slides.length === 0) {
    throw new Error('No slides to export');
  }

  const pptx = new PptxGenJS();
  const theme = THEMES[themeName];
  
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'PDFToSlides Pro';
  pptx.company = 'Enterprise AI Engine';

  // 1. MASTER TITLE SLIDE
  const cover = pptx.addSlide();
  cover.background = { color: theme.primary };
  
  // Theme-specific Title Slide
  if (themeName === 'executive') {
    cover.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.5, h: '100%', fill: { color: theme.accent } });
  } else if (themeName === 'creative') {
    // Add a generated abstract background for creative
    const sanitizedColor = sanitizeColor(theme.primary);
    const bgUrl = `https://image.pollinations.ai/prompt/abstract%20art%20artistic%20gradient%20${sanitizedColor}?width=1280&height=720&nologo=true`;
    cover.addImage({ path: bgUrl, x: 0, y: 0, w: '100%', h: '100%', transparency: 80 });
  }

  cover.addText(fileName.split('.')[0].toUpperCase(), {
    x: 1.5, y: 2.5, w: '80%', h: 2,
    fontSize: 48, bold: true, color: 'FFFFFF', fontFace: theme.font,
    align: 'left', valign: 'middle'
  });

  cover.addText(`${themeName.toUpperCase()} STRATEGY DECK`, {
    x: 1.5, y: 5.8, w: '80%', h: 0.5,
    fontSize: 14, color: 'CBD5E1', fontFace: theme.font,
    bold: true, charSpacing: 10
  });

  // 2. CONTENT SLIDES
  for (let index = 0; index < slides.length; index++) {
    const slideData = slides[index];
    const slide = pptx.addSlide();
    slide.background = { color: theme.secondary };
    
    // Header
    slide.addText(slideData.category?.toUpperCase() || "SECTION", {
        x: 0.5, y: 0.15, w: 3, h: 0.2,
        fontSize: 9, color: theme.accent, fontFace: theme.font, bold: true
    });

    slide.addText(slideData.title, {
      x: 0.5, y: 0.35, w: '90%', h: 0.8,
      fontSize: 24, bold: true, color: themeName === 'executive' ? theme.primary : theme.text,
      fontFace: theme.font, valign: 'middle'
    });

    // Check if we have a valid image prompt
    const hasImage = !!(slideData.imagePrompt && slideData.imagePrompt.trim().length > 0);
    
    // Layout Logic:
    // If hasImage: Text takes left ~55%, Image takes right ~40%
    // If NO image: Text takes full width ~90%
    const textW = hasImage ? 6.5 : 12.3; 
    const textFontSize = hasImage ? 12 : 14; // Slightly larger font if no image to fill space comfortably

    // Bullets
    const bulletItems = slideData.bullets.map(b => ({ 
        text: b, 
        options: { 
             bullet: { code: '2022', margin: 10 }, 
             color: theme.text,
             fontSize: textFontSize,
             lineSpacing: 22,
             paraSpaceBefore: 8
        } 
    }));

    slide.addText(bulletItems, {
      x: 0.5, y: 1.3, w: textW, h: 5.5,
      valign: 'top', fontFace: theme.font
    });

    // AI Generated Image or Chart
    if (hasImage) {
        // Use Pollinations.ai with sanitized prompt
        const sanitizedImagePrompt = sanitizePrompt(slideData.imagePrompt);
        const fullPrompt = sanitizedImagePrompt + " high quality, detailed, professional, 4k, no text";
        const safePrompt = encodeURIComponent(fullPrompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${safePrompt}?width=800&height=600&nologo=true&seed=${index}`;

        // Visual Container Box
        slide.addShape(pptx.ShapeType.rect, {
            x: 7.3, y: 1.3, w: 5.5, h: 4.0,
            fill: { color: 'F1F5F9' },
            line: { color: 'E2E8F0', width: 1 }
        });

        // Add Image inside container
        slide.addImage({
            path: imageUrl,
            x: 7.4, y: 1.4, w: 5.3, h: 3.8,
            sizing: { type: 'contain', w: 5.3, h: 3.8 }
        });
        
        // Caption
        slide.addText("AI Generated Visual", {
            x: 7.3, y: 5.4, w: 5.5, h: 0.3,
            fontSize: 8, color: '94A3B8', align: 'center', italic: true
        });
    }

    // Diagrams (if diagram type exists but no image, we can put diagram on right or bottom)
    if (slideData.diagramType && slideData.diagramType !== 'text') {
         const chartX = hasImage ? 7.3 : 0.5;
         const chartY = hasImage ? 5.8 : 5.8; // Bottom if full width
         const chartW = hasImage ? 5.5 : 12.3;
         const chartH = 1.2;
         
         if (slideData.diagramType === 'bar_chart') {
             slide.addChart(pptx.ChartType.bar, [
                {
                  name: 'Projected Metrics',
                  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                  values: [25, 40, 55, 80]
                }
             ], { x: chartX, y: chartY, w: chartW, h: chartH, barDir: 'col', chartColors: [theme.chartColors[0]] });
         }
    }

    // Footer
    slide.addText(`${index + 1} | ${fileName}`, {
      x: 10.5, y: 7.2, w: 2.5, h: 0.3,
      fontSize: 8, color: 'CBD5E1', align: 'right'
    });
  }

  await pptx.writeFile({ fileName: `${fileName.split('.')[0]}_${themeName}.pptx` });
};