/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import POS from './components/POS';
import Inventory from './components/Inventory';
import LoginModal from './components/LoginModal';
import { ConversionJob, AppView, SlideData, PPTVariant } from './types';
import { NEWS_SOURCES } from './constants';
import { apiService, APIError } from './services/apiService';
import { logger } from './services/loggerService';
import { env } from './config/environment';
import { useToast } from './contexts/ToastContext';
import { extractTextFromPdf, extractTextFromPdfPages } from './services/pdfService';
import { analyzePdfForSlides } from './services/geminiService';
import { generatePptx } from './services/pptxService';

const App: React.FC = () => {
  const { showToast } = useToast();
  const [view, setView] = useState<AppView>('landing');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [feed, setFeed] = useState<ConversionJob[]>([]);
  const [archive, setArchive] = useState<ConversionJob[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [conversionStage, setConversionStage] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Initialize environment and print configuration
    env.printSummary();
    logger.info('PDFSlider application starting', {
      environment: env.getEnvironment(),
      apiConfigured: !!env.getApiKey()
    });

    // Load saved data with proper error handling
    try {
      const savedFeed = localStorage.getItem('pdfslider_feed');
      if (savedFeed) {
        try {
          const parsedFeed = JSON.parse(savedFeed);
          if (Array.isArray(parsedFeed)) {
            setFeed(parsedFeed);
          }
        } catch (parseError) {
          logger.warn('Failed to parse saved feed, clearing corrupted data', parseError as Error);
          localStorage.removeItem('pdfslider_feed');
        }
      }

      const savedArchive = localStorage.getItem('pdfslider_archive');
      if (savedArchive) {
        try {
          const parsedArchive = JSON.parse(savedArchive);
          if (Array.isArray(parsedArchive)) {
            setArchive(parsedArchive);
          }
        } catch (parseError) {
          logger.warn('Failed to parse saved archive, clearing corrupted data', parseError as Error);
          localStorage.removeItem('pdfslider_archive');
        }
      }

      const savedUser = localStorage.getItem('pdfslider_user');
      if (savedUser) setUserName(savedUser);

      const savedLoginState = localStorage.getItem('pdfslider_logged_in');
      if (savedLoginState === 'true') setIsLoggedIn(true);
    } catch (storageError) {
      logger.error('localStorage access failed (may be disabled or in private mode)', storageError as Error);
      showToast('Unable to access local storage. Some features may be limited.', 'warning');
    }

    // Check API status
    const apiStatus = apiService.getStatus();
    logger.info('API Service Status', apiStatus);

    setIsLoading(false);
  }, []);

  const handleNav = (targetId: string) => {
    setIsAnimating(true);
    setTimeout(() => {
      setView(targetId as AppView);
      setIsAnimating(false);
    }, 300);
  };

  const handleLogin = (name: string) => {
    setUserName(name);
    setIsLoggedIn(true);
    setShowLogin(false);
    localStorage.setItem('pdfslider_user', name);
    localStorage.setItem('pdfslider_logged_in', 'true');
  };

  const attemptConversion = async (file: File) => {
    setIsConverting(true);
    setConversionProgress(0);
    setConversionStage('Initializing...');

    logger.info('Starting document conversion', { fileName: file.name });

    try {
      // Stage 1: Validating
      setConversionProgress(5);
      setConversionStage('Validating file...');
      await new Promise(resolve => setTimeout(resolve, 300));

      // Stage 2: Extract text from PDF page-by-page
      let pdfPages: string[] = [];
      let pageCount = 0;

      if (file.type === 'application/pdf') {
        setConversionProgress(15);
        setConversionStage('Extracting text from PDF...');
        try {
          pdfPages = await extractTextFromPdfPages(file);
          pageCount = pdfPages.length;
          logger.info('PDF pages extracted', { pageCount });
        } catch (pdfError) {
          logger.warn('PDF extraction failed, using fallback', pdfError as Error);
          pdfPages = [`Document: ${file.name}\n\nThis is a placeholder as PDF extraction encountered an issue.`];
          pageCount = 1;
        }
      } else {
        // For DOCX or other formats, use placeholder
        pdfPages = [`Document: ${file.name}\n\nProcessing DOCX files requires additional setup.`];
        pageCount = 1;
      }

      // Stage 3: Convert each page to a slide
      setConversionProgress(35);
      setConversionStage('Converting pages to slides...');

      // Helper function to convert page text to bullets
      const convertPageToSlide = (pageText: string, pageNum: number): SlideData => {
        // Split text into sentences or paragraphs
        const sentences = pageText
          .split(/[.!?]\s+/)
          .filter(s => s.trim().length > 20)
          .map(s => s.trim().substring(0, 150)); // Limit each bullet to 150 chars

        // Take up to 5 bullets per slide
        const bullets = sentences.slice(0, 5);

        // If no bullets found, use the full text split by length
        if (bullets.length === 0) {
          const chunks = pageText.match(/.{1,150}/g) || ['No content'];
          bullets.push(...chunks.slice(0, 5));
        }

        return {
          title: `Page ${pageNum}`,
          bullets: bullets.length > 0 ? bullets : ['No extractable content on this page'],
          category: `Content`,
          diagramType: 'text',
          imagePrompt: ''
        };
      };

      const allSlides: SlideData[] = pdfPages.map((pageText, idx) =>
        convertPageToSlide(pageText, idx + 1)
      );

      setConversionProgress(70);
      setConversionStage('Building presentation variants...');

      // Create variants with all slides
      const variants: PPTVariant[] = [
        { id: 'v1', name: 'Executive Summary', slides: allSlides, theme: 'executive', color: '#4F46E5' },
        { id: 'v2', name: 'Creative Deck', slides: allSlides, theme: 'creative', color: '#8B5CF6' },
        { id: 'v3', name: 'Technical Details', slides: allSlides, theme: 'minimal', color: '#0EA5E9' }
      ];

      // Generate thumbnail URL (using first slide's image or placeholder)
      const firstSlide = variants[0]?.slides[0];
      const thumbnailUrl = firstSlide?.imagePrompt
        ? `https://image.pollinations.ai/prompt/${encodeURIComponent(firstSlide.imagePrompt.substring(0, 100))}?width=400&height=300&nologo=true`
        : 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop';

      // Stage 4: Finalize job
      setConversionProgress(90);
      setConversionStage('Finalizing presentation...');

      const job: ConversionJob = {
        id: `job-${Date.now()}`,
        title: file.name.replace(/\.(pdf|docx)$/i, ''),
        originalFileName: file.name,
        status: 'Completed',
        timestamp: Date.now(),
        pageCount: variants[0]?.slides.length || pageCount,
        previewSlides: [], // Could populate with preview image URLs
        thumbnailUrl,
        format: 'PPTX',
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        source: file.name,
        variants
      };

      setConversionProgress(100);
      setConversionStage('Complete!');

      logger.info('Document conversion completed successfully', { jobId: job.id, slideCount: job.pageCount });
      showToast('Document processed successfully! ' + job.pageCount + ' slides generated.', 'success');

      setTimeout(() => {
        // Use functional state update to avoid race conditions
        setFeed(prevFeed => {
          const newFeed = [job, ...prevFeed];
          try {
            localStorage.setItem('pdfslider_feed', JSON.stringify(newFeed));
          } catch (storageError) {
            logger.error('Failed to save feed to localStorage', storageError as Error);
          }
          return newFeed;
        });
        setIsConverting(false);
        handleNav('workbench');
      }, 500);
    } catch (error) {
      logger.error('Conversion error', error as Error, { fileName: file.name });

      let errorMessage = 'Failed to process document';

      if (error instanceof APIError) {
        if (error.code === 'RATE_LIMIT_EXCEEDED') {
          errorMessage = 'Rate limit exceeded. Please try again in a moment.';
        } else if (error.code === 'FILE_VALIDATION_FAILED') {
          errorMessage = error.message;
        } else {
          errorMessage = error.message;
        }
      }

      showToast(errorMessage, 'error');
      setConversionStage('Failed');
      setIsConverting(false);
    }
  };

  const handleExport = async (job: ConversionJob, variantId?: string) => {
    try {
      // Get the variant to export (default to first variant if not specified)
      const variant = variantId
        ? job.variants?.find(v => v.id === variantId)
        : job.variants?.[0];

      if (!variant || !variant.slides || variant.slides.length === 0) {
        showToast('No slides found to export', 'error');
        return;
      }

      showToast(`Generating ${variant.name}...`, 'info');
      logger.info('Export started', { jobId: job.id, variantId: variant.id, slideCount: variant.slides.length });

      // Generate PPTX using the variant's theme
      const themeName = variant.theme as 'executive' | 'creative' | 'minimal';
      await generatePptx(variant.slides, job.title, themeName);

      showToast(`Successfully downloaded ${variant.name}!`, 'success');
      logger.info('Export completed', { jobId: job.id, variantId: variant.id });
    } catch (error) {
      logger.error('Export failed', error as Error, { jobId: job.id, variantId });
      showToast('Failed to generate PPTX. Please try again.', 'error');
    }
  };

  const handleArchiveOp = (job: ConversionJob, op: 'add' | 'delete') => {
    if (op === 'add') {
      // Use functional state updates to avoid race conditions
      setArchive(prevArchive => {
        const newArchive = [job, ...prevArchive];
        try {
          localStorage.setItem('pdfslider_archive', JSON.stringify(newArchive));
        } catch (storageError) {
          logger.error('Failed to save archive to localStorage', storageError as Error);
        }
        return newArchive;
      });
      setFeed(prevFeed => {
        const newFeed = prevFeed.filter(j => j.id !== job.id);
        try {
          localStorage.setItem('pdfslider_feed', JSON.stringify(newFeed));
        } catch (storageError) {
          logger.error('Failed to save feed to localStorage', storageError as Error);
        }
        return newFeed;
      });
    } else {
      setArchive(prevArchive => {
        const newArchive = prevArchive.filter(j => j.id !== job.id);
        try {
          localStorage.setItem('pdfslider_archive', JSON.stringify(newArchive));
        } catch (storageError) {
          logger.error('Failed to save archive to localStorage', storageError as Error);
        }
        return newArchive;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center" style={{backgroundColor: '#F8FAFC'}}>
          <div className="border border-4 rounded-circle animate-spin mb-3" style={{width: '4rem', height: '4rem', borderColor: '#0F172A', borderTopColor: 'transparent'}}></div>
          <div className="fw-bold text-secondary fs-6 letterSpacing uppercase animate-pulse" style={{letterSpacing: '0.25em'}}>Initializing Engine</div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{backgroundColor: '#F8FAFC', color: '#0F172A'}}>
      <Navbar
        onNavClick={handleNav}
        activeView={view}
        shopName={userName}
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setShowLogin(true)}
      />

      {/* Login Modal */}
      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />
      )}

      {/* Progress Overlay */}
      {isConverting && (
        <div className="position-fixed top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center" style={{zIndex: 300, backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', animation: 'fadeIn 0.6s ease-out'}}>
           <div className="mx-auto p-4 text-center" style={{maxWidth: '28rem'}}>
              <div className="position-relative mx-auto mb-4" style={{width: '6rem', height: '6rem'}}>
                  <svg className="w-100 h-100" style={{transform: 'rotate(-90deg)'}}>
                    <circle cx="48" cy="48" r="40" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                    <circle
                      cx="48" cy="48" r="40"
                      fill="none" stroke="#0F172A" strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * conversionProgress) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-300 ease-out"
                    />
                  </svg>
                  <div className="position-absolute top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center fw-bold fs-4" style={{color: '#0F172A'}}>
                    {conversionProgress}%
                  </div>
              </div>
              <h2 className="fs-3 fw-bold mb-2" style={{color: '#0F172A'}}>Synthesizing Presentation</h2>
              <p className="text-muted fs-6 fw-medium animate-pulse">{conversionStage}</p>
           </div>
        </div>
      )}

      <main className="flex-fill min-vh-100" style={{paddingTop: '5rem', opacity: isAnimating ? 0 : 1, transform: isAnimating ? 'translateY(1rem)' : 'translateY(0)', transition: 'all 0.5s'}}>
        {view === 'landing' && (
           <div className="view-enter-active">
              <Hero onFileSelect={attemptConversion} />
           </div>
        )}

        {view === 'workbench' && (
            <div className="view-enter-active">
              {/* Back Button */}
              <div className="px-3 px-md-4 pb-3">
                <button
                  onClick={() => handleNav('landing')}
                  className="btn btn-light d-flex align-items-center gap-2 rounded-pill shadow-sm border"
                  style={{fontSize: '0.9rem'}}
                >
                  <svg style={{width: '18px', height: '18px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                  Back to Home
                </button>
              </div>

              <POS
                feed={feed}
                onArchive={(job) => handleArchiveOp(job, 'add')}
                onExport={handleExport}
                onFileSelect={attemptConversion}
                shopName={userName}
              />
            </div>
        )}

        {view === 'vault' && (
            <div className="view-enter-active">
              {/* Back Button */}
              <div className="px-3 px-md-4 pb-3">
                <button
                  onClick={() => handleNav('landing')}
                  className="btn btn-light d-flex align-items-center gap-2 rounded-pill shadow-sm border"
                  style={{fontSize: '0.9rem'}}
                >
                  <svg style={{width: '18px', height: '18px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                  Back to Home
                </button>
              </div>

              <Inventory
                products={archive}
                onOp={handleArchiveOp}
                onExport={handleExport}
                categories={NEWS_SOURCES.map(s => s.name)}
              />
            </div>
        )}
      </main>

      {view === 'landing' && <Footer onLinkClick={(e, id) => { e.preventDefault(); handleNav(id); }} />}
    </div>
  );
};

export default App;
