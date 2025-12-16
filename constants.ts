
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { ConversionJob, NewsSource, JournalArticle } from './types';

export const BRAND_NAME = 'PDFToSlides Pro';

export const EXPORT_FORMATS: NewsSource[] = [
  { id: "pptx", name: "PowerPoint", url: "", icon: "📊", color: "#D04423", active: true },
  { id: "gslides", name: "Google Slides", url: "", icon: "🟡", color: "#FBBC04", active: true },
  { id: "keynote", name: "Keynote", url: "", icon: "🎭", color: "#000000", active: true },
  { id: "pdf_flat", name: "Flattened PDF", url: "", icon: "📄", color: "#6A4FBF", active: true }
];

export const NEWS_SOURCES = EXPORT_FORMATS;

export const FEATURES = [
  { 
    title: "Strategic Layouts", 
    desc: "Reconstructs documents into executive-style slide arcs (Context -> Action -> Impact).",
    icon: "✨",
    color: "#6A4FBF"
  },
  { 
    title: "Neural Synthesis", 
    desc: "Gemini 2.5 Pro identifies key signals and eliminates fluff for higher-velocity reading.",
    icon: "🤖",
    color: "#2AB9A9"
  },
  { 
    title: "Master Assets", 
    desc: "Maintains high-fidelity vector preservation and modern typography for all exports.",
    icon: "📐",
    color: "#FFB673"
  }
];

export const INITIAL_FEED: ConversionJob[] = [];

export const GLOSSARY: Record<string, string> = {
  "Neural Synthesis": "Using advanced LLM reasoning to extract meaning rather than just keywords.",
  "Strategic Arc": "The narrative flow of a presentation designed to persuade executive audiences.",
  "Payload Density": "The amount of valuable information per slide, optimized for cognitive load."
};

export const getPublisherInfo = (name: string) => {
  const char = name.charAt(0).toUpperCase();
  const colors: Record<string, string> = {
    'P': '#D04423', 
    'G': '#FBBC04',
    'K': '#000000',
    'F': '#6A4FBF',
    'J': '#2AB9A9'
  };
  return {
    logo: char,
    color: colors[char] || '#6A4FBF'
  };
};

// Added missing JOURNAL_ARTICLES export to fix import error in components/Journal.tsx
export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: '1',
    title: 'The Future of AI in Presentations',
    date: 'March 15, 2025',
    excerpt: 'Exploring how generative models are reshaping executive storytelling.',
    content: 'Generative AI is not just about automation; it\'s about augmentation. By leveraging Gemini 2.5 Pro, we can extract the strategic intent behind static documents.'
  },
  {
    id: '2',
    title: 'Psychology of Slide Design',
    date: 'March 10, 2025',
    excerpt: 'How cognitive load impacts the effectiveness of your deck.',
    content: 'Less is more. Cognitive load theory suggests that our working memory has a limited capacity. Decks should focus on high-impact signals.'
  },
  {
    id: '3',
    title: 'From PDF to Strategy',
    date: 'March 5, 2025',
    excerpt: 'A technical deep dive into PDF parsing and neural reconstruction.',
    content: 'Converting a PDF to a PPTX is a multi-stage process involving structural analysis, neural synthesis, and vector reconstruction.'
  }
];
