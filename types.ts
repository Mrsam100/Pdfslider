/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface SlideData {
  title: string;
  bullets: string[];
  category: string;
  diagramType?: string;
  visualDescription?: string;
  imagePrompt: string; // New field for AI Image Generation
}

export interface PPTVariant {
  id: string;
  name: string;
  theme: 'executive' | 'creative' | 'minimal';
  color: string;
  slides: SlideData[]; // Each variant now has its own unique content
}

export interface ConversionJob {
  id: string;
  title: string;
  originalFileName: string;
  pageCount: number;
  status: 'Completed' | 'Processing' | 'Failed';
  timestamp: number;
  thumbnailUrl?: string;
  previewSlides: string[];
  format: 'PPTX' | 'Google Slides' | 'Keynote';
  fileSize: string;
  source: string;
  // rawSlides is deprecated in favor of variants[].slides
  rawSlides?: SlideData[]; 
  variants?: PPTVariant[];
}

export interface ConversionLog {
  id: string;
  fileName: string;
  status: 'uploaded' | 'parsing' | 'generating' | 'ready';
  timestamp: number;
}

export type AppView = 'landing' | 'workbench' | 'vault' | 'logs' | 'insights' | 'settings';

export interface AppSettings {
  language: 'en' | 'ar' | 'hi' | 'es' | 'fr';
  darkMode: boolean;
  autoCopy: boolean;
  theme: 'minimal';
  sources: string[];
  businessType?: string;
  currency?: string;
  taxRate?: number;
  defaultEmail?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface JournalArticle {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

export type NewsArticle = ConversionJob;

export interface NewsLog {
  id: string;
  articleTitle: string;
  source: string;
  timestamp: number;
  status: string;
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  active: boolean;
}

export interface Paper {
  id: string;
  title: string;
  publisher: string;
  authors: string[];
  abstract: string;
  abstractPreview: string;
  publicationDate: string;
  category: string;
  doi: string;
  whyMatters: string;
  upvotes: number;
  timestamp: number;
  aiInsights: string[];
  publisherLogo: string;
  readTime: string;
  description?: string;
  fileUrl?: string;
}