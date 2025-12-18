/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Type } from "@google/genai";

// Safely get API key - don't crash if not available
// Note: In Vite, environment variables must be prefixed with VITE_ to be exposed to the client
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

// Initialize AI client only if API key is available
if (API_KEY && API_KEY !== 'your_api_key_here') {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
    console.log('Gemini AI initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Gemini AI:', error);
  }
} else {
  console.warn('Gemini API key not configured. AI features will be limited.');
}

interface SlideData {
  title: string;
  bullets: string[];
  category: string;
  diagramType: string;
  imagePrompt?: string;
}

interface GeminiResponse {
  executiveDeck: SlideData[];
  creativeDeck: SlideData[];
  technicalDeck: SlideData[];
}

export const analyzePdfForSlides = async (
  rawText: string,
  timeoutMs: number = 120000, // 2 minutes default timeout
  maxRetries: number = 2
): Promise<GeminiResponse | null> => {
  // Check if AI client is initialized
  if (!ai) {
    console.error('Gemini AI not initialized. Please configure API_KEY in your .env file.');
    return null;
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`Retry attempt ${attempt} of ${maxRetries}...`);
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }

      // INCREASED CONTEXT LIMIT: 800,000 characters (~200k tokens) to ensure ALL data from large PDFs is captured.
      const context = rawText.substring(0, 800000);

    const prompt = `You are an elite Presentation Architect. Your task is to transform the provided document into three distinct presentation decks.

    CRITICAL REQUIREMENT: 
    - You must incorporate **EACH AND EVERY WORD OF DATA** from the source where possible. 
    - **DO NOT SUMMARIZE** if it causes loss of detail. Include all statistics, names, facts, and figures.
    - If the document is dense, create MORE slides to accommodate the text. Do not compress it.
    - Only request an image if the slide specifically warrants a visual representation (e.g., a chart, a specific scene, a diagram). If the slide is purely text-heavy data, leave the image prompt empty to maximize text space.

    SOURCE DOCUMENT:
    ${context}

    TASK:
    Generate 3 separate slide decks. Each deck must cover the ENTIRETY of the source data but with a different strategic angle:
    1. "ExecutiveDeck": Focus on ROI, outcomes, business impact, and strategic decisions.
    2. "CreativeDeck": Narrative-driven, metaphors, focus on vision, future, and human impact.
    3. "TechnicalDeck": Extremely detailed, granular data, methodology, implementation specs, and rigorous facts.

    FOR EACH SLIDE in each deck, provide:
    - title: Strong, descriptive headline.
    - bullets: 6-10 detailed points containing specific numbers/facts from the text. Make them comprehensive.
    - category: Section header.
    - diagramType: 'text', 'bar_chart', 'pie_chart', 'process_flow', 'timeline'.
    - imagePrompt: (OPTIONAL) A specific, photorealistic AI image prompt describing a visual scene. **Return an empty string** if the slide should focus purely on text data.

    OUTPUT FORMAT: JSON Object containing 3 arrays: executiveDeck, creativeDeck, technicalDeck.
    `;

    const slideSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
        category: { type: Type.STRING },
        diagramType: { type: Type.STRING },
        imagePrompt: { type: Type.STRING, nullable: true } // Made nullable/optional logic check
      },
      required: ["title", "bullets", "category", "diagramType"] // imagePrompt is not strictly required in validation, though we check it in logic
    };

      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`API request timed out after ${timeoutMs}ms`)), timeoutMs);
      });

      // Race between API call and timeout
      const apiCallPromise = ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 4096 }, // Max thinking for complex data structuring
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executiveDeck: { type: Type.ARRAY, items: slideSchema },
              creativeDeck: { type: Type.ARRAY, items: slideSchema },
              technicalDeck: { type: Type.ARRAY, items: slideSchema }
            },
            required: ["executiveDeck", "creativeDeck", "technicalDeck"]
          }
        }
      });

      const response = await Promise.race([apiCallPromise, timeoutPromise]);

    // Safe JSON parsing with error handling
    if (!response.text) {
      throw new Error("Gemini returned empty response");
    }

    let parsedResponse: GeminiResponse;
    try {
      parsedResponse = JSON.parse(response.text);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError);
      throw new Error("Invalid JSON response from Gemini API");
    }

    // Validate response structure
    if (!parsedResponse.executiveDeck || !parsedResponse.creativeDeck || !parsedResponse.technicalDeck) {
      throw new Error("Gemini response missing required deck fields");
    }

    // Validate each deck is an array
    if (!Array.isArray(parsedResponse.executiveDeck) ||
        !Array.isArray(parsedResponse.creativeDeck) ||
        !Array.isArray(parsedResponse.technicalDeck)) {
      throw new Error("Gemini response decks are not arrays");
    }

      return parsedResponse;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Gemini Synthesis Error (attempt ${attempt + 1}):`, lastError);

      // Don't retry on certain errors
      const errorMessage = lastError.message.toLowerCase();
      if (errorMessage.includes('invalid') ||
          errorMessage.includes('parse') ||
          errorMessage.includes('json')) {
        // These are not transient errors, don't retry
        break;
      }

      // If this was the last attempt, break
      if (attempt === maxRetries) {
        break;
      }
    }
  }

  // All retries exhausted
  console.error("All retry attempts exhausted. Final error:", lastError);
  return null;
};