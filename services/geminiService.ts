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
  timeoutMs: number = 300000, // 5 minutes default timeout for larger PDFs
  maxRetries: number = 3
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

    const prompt = `You are an elite Presentation Designer and Content Strategist. Transform the provided document into three visually stunning, professionally structured presentation decks.

    DESIGN PRINCIPLES:
    - Create presentation-ready content that looks PROFESSIONAL and POLISHED
    - Use clear visual hierarchy with powerful headlines and concise, impactful bullet points
    - Each bullet should be ONE clear, complete thought (not just a fragment)
    - Include ALL critical data, statistics, and key insights from the source
    - Think like a designer: structure content for maximum visual appeal and clarity

    CONTENT QUALITY STANDARDS:
    - Titles: Powerful, action-oriented headlines (6-10 words max). Use strong verbs.
    - Bullets: 4-6 high-impact points per slide. Each bullet should be a complete sentence or powerful statement.
    - Language: Professional, confident, concise. Avoid filler words.
    - Data: Include specific numbers, percentages, and metrics where available
    - Structure: Logical flow from high-level concepts to specific details

    SOURCE DOCUMENT:
    ${context}

    TASK:
    Generate 3 professionally designed slide decks. Each deck covers the source material with a different strategic lens:

    1. "ExecutiveDeck": Strategic focus
       - Business outcomes, ROI, market impact, decision frameworks
       - Bold, confident language with clear business value
       - Use metrics and KPIs prominently

    2. "CreativeDeck": Narrative focus
       - Story-driven content with vision and inspiration
       - Human impact, innovation, future possibilities
       - Use metaphors and compelling narratives

    3. "TechnicalDeck": Detailed focus
       - In-depth methodology, implementation details, technical specs
       - Comprehensive data, processes, and frameworks
       - Precise, technical language with complete information

    FOR EACH SLIDE:
    - title: Compelling, action-oriented headline (6-10 words). Examples: "Driving 40% Revenue Growth Through Innovation", "Transforming Customer Experience with AI"
    - bullets: 4-6 impactful, complete sentences. Each bullet must:
      • Start with a strong verb or key concept
      • Include specific data/numbers when available
      • Be clear and self-contained (not fragments)
      • Create visual hierarchy (mix short and medium-length points)
    - category: Clear section header (2-4 words). Examples: "Strategic Overview", "Market Analysis", "Implementation Roadmap"
    - diagramType: Choose the BEST visual type for the content:
      • 'text' - For concept-heavy, strategy, or narrative content
      • 'bar_chart' - For comparisons, growth trends, performance metrics
      • 'pie_chart' - For market share, distribution, percentage breakdowns
      • 'process_flow' - For workflows, timelines, sequential steps
      • 'timeline' - For historical data, project phases, roadmaps
    - imagePrompt: (STRATEGIC USE ONLY)
      • For data visualization slides: Leave EMPTY (use diagramType instead)
      • For conceptual/vision slides: Provide a detailed, professional image prompt
      • Format: "Professional [subject] showing [specific elements], modern corporate style, clean design, high quality"
      • Only include when the visual significantly enhances understanding

    SLIDE STRUCTURE EXAMPLES:

    GOOD Executive Slide:
    {
      "title": "Delivering 45% Efficiency Gains Through Digital Transformation",
      "bullets": [
        "Automated core processes reduced operational costs by $2.3M annually",
        "Customer satisfaction scores improved from 72% to 94% in 6 months",
        "Processing time decreased from 48 hours to 4 hours per transaction",
        "Employee productivity increased 35% with new collaborative tools",
        "ROI achieved in 8 months, 18 months ahead of projections"
      ],
      "category": "Business Impact",
      "diagramType": "bar_chart",
      "imagePrompt": ""
    }

    GOOD Creative Slide:
    {
      "title": "Reimagining the Future of Customer Engagement",
      "bullets": [
        "Transform every interaction into a personalized, memorable experience",
        "Empower customers with intelligent self-service tools that anticipate needs",
        "Build lasting relationships through proactive, empathetic communication",
        "Create seamless omnichannel journeys that delight at every touchpoint"
      ],
      "category": "Vision & Innovation",
      "diagramType": "text",
      "imagePrompt": "Professional diverse business team collaborating in modern office space with futuristic technology interfaces, innovative workspace, bright natural lighting, high quality corporate photography"
    }

    BAD Slide (DON'T DO THIS):
    {
      "title": "Information",
      "bullets": [
        "Various improvements",
        "Better results",
        "Cost reduction",
        "Increased efficiency",
        "Good outcomes",
        "Positive feedback",
        "More data",
        "New processes"
      ],
      "category": "Update",
      "diagramType": "text",
      "imagePrompt": "business stuff"
    }

    OUTPUT FORMAT: JSON Object with 3 arrays: executiveDeck, creativeDeck, technicalDeck.
    Each deck should have 6-12 slides covering all key content from the source material.
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