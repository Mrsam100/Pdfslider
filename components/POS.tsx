/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { ConversionJob } from '../types';
import { useToast } from '../contexts/ToastContext';

interface StudioProps {
  feed: ConversionJob[];
  onArchive: (job: ConversionJob) => void;
  onExport: (job: ConversionJob, variantId?: string) => void;
  onFileSelect: (file: File) => void;
  shopName: string;
}

const POS: React.FC<StudioProps> = ({ feed, onArchive, onExport, onFileSelect, shopName }) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedJob, setSelectedJob] = useState<ConversionJob | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingThumbnails, setLoadingThumbnails] = useState<Record<string, boolean>>({});
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Validate and sanitize image URLs to prevent XSS
   */
  const sanitizeImageUrl = (url: string | undefined): string => {
    if (!url) return '';

    // Only allow http, https, and data URLs
    try {
      const urlObj = new URL(url);
      if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:' || url.startsWith('data:image/')) {
        return url;
      }
    } catch {
      // Invalid URL, return empty string
      return '';
    }

    // Block javascript:, vbscript:, and other dangerous protocols
    return '';
  };

  const processFile = async (file: File | null) => {
    if (!file) return;
    const type = file.name.split('.').pop()?.toLowerCase();
    if (type === 'pdf' || type === 'docx') {
      setIsUploading(true);
      try {
        await onFileSelect(file);
      } finally {
        setIsUploading(false);
      }
    } else {
      showToast("Strategic Engine exclusively processes PDF and DOCX formats.", 'error');
    }
  };

  const handleExport = async (job: ConversionJob, variantId?: string) => {
    setIsExporting(true);
    try {
      await onExport(job, variantId);
    } finally {
      setIsExporting(false);
    }
  };

  const handleOpenPreview = (job: ConversionJob) => {
      setSelectedJob(job);
      setCurrentSlideIndex(0); // Reset to first slide
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -600, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 600, behavior: 'smooth' });
    }
  };

  const handleClosePreview = () => {
    setSelectedJob(null);
    setCurrentSlideIndex(0);
  };

  const handleThumbnailLoad = (jobId: string) => {
    setLoadingThumbnails(prev => ({ ...prev, [jobId]: false }));
  };

  const handleThumbnailError = (jobId: string) => {
    setLoadingThumbnails(prev => ({ ...prev, [jobId]: false }));
  };

  // Initialize loading state for all thumbnails
  useEffect(() => {
    const initialLoadingState: Record<string, boolean> = {};
    feed.forEach(job => {
      initialLoadingState[job.id] = true;
    });
    setLoadingThumbnails(initialLoadingState);
  }, [feed]);

  // Get first variant's slides (always show the primary variant)
  const activeSlides = selectedJob?.variants?.[0]?.slides || [];

  return (
    <div className="mx-auto p-3 p-md-4" style={{maxWidth: '1400px', minHeight: 'calc(100vh - 80px)', backgroundColor: '#ffffff'}}>

      {/* MAIN PANEL: GENERATED DECKS & PREVIEW */}
      <div className="w-100 d-flex flex-column gap-3">
          <div className="d-flex align-items-center justify-content-between px-2 py-3 position-sticky" style={{top: '10rem', backgroundColor: '#ffffff', zIndex: 99, borderBottom: '1px solid #e5e7eb'}}>
              <h3 className="fs-4 fs-md-3 fw-bolder" style={{color: '#0F172A'}}>Recent Projects</h3>
              <button className="fs-6 fw-bold" style={{color: '#4F46E5'}} onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}>View All History</button>
          </div>

          <div className="row g-3">
              {feed.length === 0 ? (
                  <div className="col-12">
                      <div className="clay-card p-5 text-center d-flex flex-column align-items-center justify-content-center border border-2 border-dashed" style={{minHeight: '400px', borderColor: '#cbd5e1', backgroundColor: 'white'}}>
                          <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mb-4 shadow-sm" style={{width: '80px', height: '80px'}}>
                              <svg style={{width: '40px', height: '40px', color: '#64748b'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                              </svg>
                          </div>
                          <h4 className="fs-4 fw-bold mb-2" style={{color: '#0f172a'}}>No Projects Yet</h4>
                          <p className="fs-6 text-muted fw-medium mb-4" style={{maxWidth: '400px'}}>Upload a PDF or DOCX document on the left to generate your first presentation slides.</p>
                      </div>
                  </div>
              ) : (
                  feed.map(job => (
                      <div key={job.id} className="col-12 col-md-6 col-lg-4">
                        <div className="clay-card p-0 bg-white d-flex flex-column overflow-hidden" style={{transition: 'all 0.3s', border: '1px solid #e0e0e0'}} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.15)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = ''}>
                          {/* Thumbnail - PPT 16:9 Aspect Ratio */}
                          <div className="w-100 position-relative overflow-hidden" style={{aspectRatio: '16/9', backgroundColor: '#f8f9fa'}}>
                              {loadingThumbnails[job.id] && (
                                <div className="skeleton w-100 h-100 position-absolute top-0 start-0"></div>
                              )}
                              <img
                                src={sanitizeImageUrl(job.thumbnailUrl) || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="256" height="192"%3E%3Crect width="256" height="192" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif"%3ENo Image%3C/text%3E%3C/svg%3E'}
                                className="w-100 h-100"
                                style={{objectFit: 'cover', opacity: loadingThumbnails[job.id] ? 0 : 0.9, transition: 'transform 0.3s'}}
                                alt="Cover"
                                onLoad={() => handleThumbnailLoad(job.id)}
                                onError={(e) => {
                                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="256" height="192"%3E%3Crect width="256" height="192" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif"%3ENo Image%3C/text%3E%3C/svg%3E';
                                  handleThumbnailError(job.id);
                                }}
                              />
                          </div>
                          
                          <div className="flex-fill p-3 p-md-3 d-flex flex-column justify-content-between">
                              <div>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h4 className="fs-5 fs-md-4 fw-bold" style={{color: '#0F172A'}}>{job.title}</h4>
                                    <span className="fs-6 fw-bolder text-success bg-success-subtle px-2 py-1 rounded text-uppercase flex-shrink-0 ms-2" style={{letterSpacing: '0.25em'}}>Done</span>
                                </div>
                                <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3 fs-6 fw-medium text-secondary mb-3">
                                    <span>{job.originalFileName}</span>
                                    <span className="d-none d-md-inline">•</span>
                                    <span>{job.pageCount} Slides</span>
                                </div>
                              </div>

                              <div className="d-flex align-items-center gap-3">
                                  <button
                                    onClick={() => handleOpenPreview(job)}
                                    className="px-4 py-2 text-white fs-6 fw-bold rounded-3 shadow d-flex align-items-center gap-2 transition-all"
                                    style={{backgroundColor: '#0F172A'}}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'black'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0F172A'}
                                  >
                                    <svg style={{width: '16px', height: '16px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                    View Slides
                                  </button>
                              </div>
                          </div>
                        </div>
                      </div>
                  ))
              )}
          </div>
      </div>

      {/* SLIDE PREVIEW MODAL */}
      {selectedJob && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex p-0"
            style={{zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.95)'}}
            onClick={(e) => {
              // Close modal when clicking on backdrop
              if (e.target === e.currentTarget) {
                setSelectedJob(null);
              }
            }}
          >
              <div className="w-100 bg-white overflow-hidden d-flex flex-column" style={{maxWidth: '100%', height: '100vh'}}>
                  {/* Header with Download Button */}
                  <div className="bg-white px-4 py-3 border-bottom flex-shrink-0 shadow-sm">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="flex-fill">
                              <h3 className="fs-4 fw-bold mb-0" style={{color: '#0F172A'}}>{selectedJob.title} <span className="fs-6 text-muted fw-normal">({activeSlides.length} slides)</span></h3>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <button
                                onClick={handleClosePreview}
                                className="rounded-circle d-flex align-items-center justify-content-center text-muted transition-colors flex-shrink-0 border-0"
                                style={{width: '40px', height: '40px', backgroundColor: '#f8f9fa'}}
                                onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = '#e9ecef'; e.currentTarget.style.transform = 'scale(1.05)';}}
                                onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = '#f8f9fa'; e.currentTarget.style.transform = 'scale(1)';}}
                                aria-label="Close preview"
                            >
                                <svg style={{width: '22px', height: '22px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                          </div>
                      </div>

                      {/* Download Button */}
                      <div className="d-flex align-items-center gap-2">
                          <button
                              onClick={() => handleExport(selectedJob)}
                              disabled={isExporting}
                              className="px-4 py-2 text-white fw-bold rounded-3 shadow d-flex align-items-center gap-2 transition-all border-0"
                              style={{backgroundColor: '#0F172A', fontSize: '0.95rem', opacity: isExporting ? 0.7 : 1, cursor: isExporting ? 'not-allowed' : 'pointer'}}
                              onMouseEnter={(e) => {if (!isExporting) {e.currentTarget.style.backgroundColor = '#000'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';}}}
                              onMouseLeave={(e) => {if (!isExporting) {e.currentTarget.style.backgroundColor = '#0F172A'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '';}}}
                          >
                              {isExporting ? (
                                <>
                                  <div className="spinner" style={{width: '18px', height: '18px', borderWidth: '2px'}}></div>
                                  Exporting...
                                </>
                              ) : (
                                <>
                                  <svg style={{width: '18px', height: '18px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                  Download PPTX
                                </>
                              )}
                          </button>
                      </div>
                  </div>

                  {/* Scrollable Slide Gallery */}
                  <div className="flex-fill d-flex flex-column position-relative" style={{backgroundColor: '#F1F5F9'}}>
                      {activeSlides.length === 0 ? (
                          <div className="text-center d-flex align-items-center justify-content-center h-100">
                              <div>
                                <div className="fs-1 mb-3 text-muted">📄</div>
                                <p className="fs-5 text-muted">No slides to display</p>
                              </div>
                          </div>
                      ) : (
                          <>
                            {/* Slide Counter */}
                            <div className="d-flex justify-content-center align-items-center py-3 border-bottom" style={{backgroundColor: '#ffffff'}}>
                              <span className="fw-bold text-dark" style={{fontSize: '1rem', letterSpacing: '0.05em'}}>
                                {activeSlides.length} Slides
                              </span>
                            </div>

                            {/* Horizontal Scrollable Gallery */}
                            <div className="position-relative flex-fill">
                              {/* Left Scroll Button */}
                              <button
                                onClick={handleScrollLeft}
                                className="position-absolute start-0 top-50 translate-middle-y btn bg-white shadow-lg border-0 d-flex align-items-center justify-content-center"
                                style={{
                                  width: '48px',
                                  height: '48px',
                                  borderRadius: '50%',
                                  zIndex: 10,
                                  marginLeft: '1rem'
                                }}
                                aria-label="Scroll left"
                              >
                                <svg style={{width: '24px', height: '24px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                              </button>

                              {/* Scrollable Container */}
                              <div
                                ref={scrollContainerRef}
                                className="d-flex gap-4 overflow-auto h-100 px-5 py-4"
                                style={{
                                  scrollBehavior: 'smooth',
                                  scrollbarWidth: 'none',
                                  msOverflowStyle: 'none'
                                }}
                              >
                                {activeSlides.map((slide, index) => (
                                  <div key={index} className="flex-shrink-0" style={{width: '600px'}}>
                                    <div className="bg-white shadow-lg d-flex flex-column position-relative overflow-hidden h-100" style={{aspectRatio: '16/9', border: '1px solid #e5e7eb'}}>
                                        {/* Top Accent Bar */}
                                        <div style={{height: '6px', background: 'linear-gradient(90deg, #0F172A 0%, #4F46E5 100%)'}}></div>

                                        {/* Slide Content */}
                                        <div className="flex-fill p-4 d-flex flex-column">
                                            {/* Category Tag */}
                                            {slide.category && (
                                              <div className="mb-2">
                                                <span className="d-inline-block px-2 py-1 text-uppercase fw-bold"
                                                      style={{
                                                        fontSize: '0.6rem',
                                                        letterSpacing: '0.15em',
                                                        color: '#4F46E5',
                                                        backgroundColor: '#EEF2FF',
                                                        borderLeft: '3px solid #4F46E5'
                                                      }}>
                                                  {slide.category}
                                                </span>
                                              </div>
                                            )}

                                            {/* Title */}
                                            <h3 className="fw-bold mb-3"
                                                style={{
                                                  color: '#0F172A',
                                                  fontSize: '1.5rem',
                                                  lineHeight: 1.2,
                                                  letterSpacing: '-0.02em',
                                                  fontWeight: 800
                                                }}>
                                              {slide.title}
                                            </h3>

                                            {/* Bullet Points */}
                                            <ul className="list-unstyled mb-0 flex-fill" style={{fontSize: '0.9rem'}}>
                                                {slide.bullets.map((b:string, i:number) => (
                                                    <li key={i}
                                                        className="d-flex align-items-start mb-2 position-relative"
                                                        style={{lineHeight: 1.6, paddingLeft: '1.5rem'}}>
                                                      {/* Bullet Marker */}
                                                      <div className="position-absolute d-flex align-items-center justify-content-center"
                                                           style={{
                                                             left: 0,
                                                             top: '0.4rem',
                                                             width: '16px',
                                                             height: '16px',
                                                             backgroundColor: '#EEF2FF',
                                                             border: '2px solid #4F46E5',
                                                             borderRadius: '50%',
                                                             flexShrink: 0
                                                           }}>
                                                        <div style={{
                                                          width: '5px',
                                                          height: '5px',
                                                          backgroundColor: '#4F46E5',
                                                          borderRadius: '50%'
                                                        }}></div>
                                                      </div>
                                                      <span className="text-dark" style={{fontSize: '0.85rem', fontWeight: 400}}>{b}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Footer with Slide Number */}
                                        <div className="d-flex justify-content-between align-items-center px-3 py-2 border-top" style={{borderColor: '#e5e7eb', backgroundColor: '#F9FAFB'}}>
                                            <div className="d-flex align-items-center gap-2">
                                              <div className="bg-dark d-flex align-items-center justify-content-center" style={{width: '20px', height: '20px'}}>
                                                <span className="fw-black text-white" style={{fontSize: '10px'}}>P</span>
                                              </div>
                                              <span className="fw-bold text-dark" style={{fontSize: '0.65rem', letterSpacing: '0.1em'}}>PDFSLIDER</span>
                                            </div>
                                            <div className="fw-bold text-dark" style={{fontSize: '0.75rem', letterSpacing: '0.05em'}}>
                                              {index + 1} / {activeSlides.length}
                                            </div>
                                        </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Right Scroll Button */}
                              <button
                                onClick={handleScrollRight}
                                className="position-absolute end-0 top-50 translate-middle-y btn bg-white shadow-lg border-0 d-flex align-items-center justify-content-center"
                                style={{
                                  width: '48px',
                                  height: '48px',
                                  borderRadius: '50%',
                                  zIndex: 10,
                                  marginRight: '1rem'
                                }}
                                aria-label="Scroll right"
                              >
                                <svg style={{width: '24px', height: '24px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                              </button>
                            </div>
                          </>
                      )}
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default POS;