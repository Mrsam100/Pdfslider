/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePdfForSlides = async (rawText: string): Promise<any> => {
  try {
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

    const response = await ai.models.generateContent({
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

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Synthesis Error:", error);
    return null;
  }
};