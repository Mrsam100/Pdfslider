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

  const processFile = (file: File | null) => {
    if (!file) return;
    const type = file.name.split('.').pop()?.toLowerCase();
    if (type === 'pdf' || type === 'docx') {
      onFileSelect(file);
    } else {
      showToast("Strategic Engine exclusively processes PDF and DOCX formats.", 'error');
    }
  };

  const handleOpenPreview = (job: ConversionJob) => {
      setSelectedJob(job);
  };

  // Get first variant's slides (always show the primary variant)
  const activeSlides = selectedJob?.variants?.[0]?.slides || [];

  return (
    <div className="mx-auto p-3 p-md-4 d-flex flex-column flex-xl-row gap-4" style={{maxWidth: '1920px', minHeight: 'calc(100vh - 80px)', backgroundColor: '#F8FAFC'}}>
      
      {/* LEFT PANEL: UPLOAD & WORKSPACE */}
      <div className="w-100 d-flex flex-column gap-3" style={{width: '33.333%'}}>
        {/* Workspace Card */}
        <div className="clay-card p-3 p-md-4 bg-white d-flex flex-column position-relative overflow-hidden shadow border-top border-4" style={{borderColor: '#4F46E5'}}>
             <div className="mb-4">
                 <span className="fs-6 fw-bolder text-secondary text-uppercase d-block mb-1" style={{letterSpacing: '0.25em'}}>Active Workspace</span>
                 <h2 className="fs-2 fs-md-3 fw-bolder text-truncate" style={{color: '#0F172A'}}>{shopName || 'Executive Studio'}</h2>
             </div>

             {/* Upload Zone */}
             <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFile(e.dataTransfer.files?.[0]); }}
                className="flex-fill d-flex flex-column align-items-center justify-content-center p-3 text-center cursor-pointer group position-relative overflow-hidden border border-4 border-dashed rounded-3"
                style={{minHeight: '250px', transition: 'all 0.2s', borderColor: isDragging ? '#4F46E5' : '#dee2e6', backgroundColor: isDragging ? 'rgba(79, 70, 229, 0.05)' : '', transform: isDragging ? 'scale(0.98)' : ''}}
                onClick={() => fileInputRef.current?.click()}
             >
                 {/* Decorative background circle */}
                 <div className="position-absolute rounded-circle pointer-events-none" style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '256px', height: '256px', backgroundColor: '#4F46E5', opacity: 0.03, transition: 'transform 0.7s'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.25)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%)'}></div>

                 <div className="rounded-3 d-flex align-items-center justify-content-center mb-3 mb-md-4 shadow transition-transform z-10" style={{width: '64px', height: '64px', transition: 'transform 0.2s', backgroundColor: isDragging ? '#4F46E5' : 'white', color: isDragging ? 'white' : '#4F46E5', border: isDragging ? 'none' : '1px solid #dee2e6'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = ''}>
                    <svg style={{width: '32px', height: '32px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                 </div>
                 <h3 className="fs-5 fs-md-4 fw-bold mb-2 z-10" style={{color: '#0F172A'}}>Start New Project</h3>
                 <p className="fs-6 fs-md-6 text-muted mb-3 mb-md-4 mx-auto fw-medium z-10" style={{maxWidth: '200px'}}>Drag PDF/DOCX here or click to browse.</p>
                 <button className="px-3 py-2 text-white fs-6 fw-bold text-uppercase rounded-3 shadow-sm z-10" style={{backgroundColor: '#0F172A', letterSpacing: '0.1em', transition: 'background-color 0.2s'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#000000'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0F172A'}>Upload File</button>
             </div>
             
             <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => processFile(e.target.files?.[0] || null)}
                accept=".pdf,.docx"
                className="d-none"
             />
        </div>
      </div>

      {/* RIGHT PANEL: GENERATED DECKS & PREVIEW */}
      <div className="w-100 d-flex flex-column gap-3" style={{width: '66.666%'}}>
          <div className="d-flex align-items-center justify-content-between px-2 py-2">
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
                      <div key={job.id} className="col-12 clay-card p-0 bg-white d-flex flex-column flex-md-row align-items-stretch overflow-hidden group" style={{transition: 'all 0.3s'}} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = ''}>
                          {/* Thumbnail */}
                          <div className="w-100 position-relative flex-shrink-0 cursor-pointer overflow-hidden" style={{width: '256px', height: '192px', backgroundColor: '#f8f9fa'}} onClick={() => handleOpenPreview(job)}>
                              <img
                                src={sanitizeImageUrl(job.thumbnailUrl) || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="256" height="192"%3E%3Crect width="256" height="192" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif"%3ENo Image%3C/text%3E%3C/svg%3E'}
                                className="w-100 h-100"
                                style={{objectFit: 'cover', opacity: 0.9, transition: 'transform 0.7s'}}
                                alt="Cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="256" height="192"%3E%3Crect width="256" height="192" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif"%3ENo Image%3C/text%3E%3C/svg%3E';
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = ''}
                              />
                              <div className="position-absolute top-0 start-0 end-0 bottom-0 d-flex align-items-end p-3" style={{background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)'}}>
                                  <span className="text-white fs-6 fw-bold text-uppercase border px-2 py-1 rounded backdrop-blur-md" style={{letterSpacing: '0.25em', borderColor: 'rgba(255,255,255,0.3)'}}>Preview</span>
                              </div>
                          </div>
                          
                          <div className="flex-fill p-3 p-md-3 d-flex flex-column justify-content-between">
                              <div>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h4 className="fs-5 fs-md-4 fw-bold cursor-pointer transition-colors" style={{color: '#0F172A'}} onClick={() => handleOpenPreview(job)} onMouseEnter={(e) => e.currentTarget.style.color = '#4F46E5'} onMouseLeave={(e) => e.currentTarget.style.color = '#0F172A'}>{job.title}</h4>
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
                          <button
                              onClick={() => setSelectedJob(null)}
                              className="rounded-circle d-flex align-items-center justify-content-center text-muted transition-colors flex-shrink-0 border-0"
                              style={{width: '40px', height: '40px', backgroundColor: '#f8f9fa'}}
                              onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = '#e9ecef'; e.currentTarget.style.transform = 'scale(1.05)';}}
                              onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = '#f8f9fa'; e.currentTarget.style.transform = 'scale(1)';}}
                          >
                              <svg style={{width: '22px', height: '22px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                      </div>

                      {/* Download Button */}
                      <div className="d-flex align-items-center gap-2">
                          <button
                              onClick={() => onExport(selectedJob)}
                              className="px-4 py-2 text-white fw-bold rounded-3 shadow d-flex align-items-center gap-2 transition-all border-0"
                              style={{backgroundColor: '#0F172A', fontSize: '0.95rem'}}
                              onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = '#000'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';}}
                              onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = '#0F172A'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '';}}
                          >
                              <svg style={{width: '18px', height: '18px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                              Download PPTX
                          </button>
                      </div>
                  </div>

                  {/* Slides Grid */}
                  <div className="flex-fill p-2" style={{backgroundColor: '#F1F5F9', overflowY: 'auto', overflowX: 'hidden'}}>
                      {activeSlides.length === 0 ? (
                          <div className="d-flex align-items-center justify-content-center h-100">
                              <div className="text-center">
                                  <div className="fs-1 mb-3 text-muted">📄</div>
                                  <p className="fs-5 text-muted">No slides to display</p>
                              </div>
                          </div>
                      ) : (
                          <div className="mx-auto" style={{maxWidth: '100%'}}>
                              <div className="row g-2">
                                  {activeSlides.map((slide, idx) => {
                                  return (
                                      <div key={idx} className="col-12 col-md-6 col-lg-4 col-xl-3">
                                          <div className="bg-white rounded-3 shadow-sm border overflow-hidden d-flex flex-column position-relative h-100" style={{minHeight: '280px', transition: 'all 0.3s', cursor: 'pointer'}} onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';}} onMouseLeave={(e) => {e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '';}}>
                                              {/* Slide Content */}
                                              <div className="flex-fill p-3 d-flex flex-column">
                                                  <div className="mb-2 rounded-pill" style={{height: '4px', width: '40px', backgroundColor: '#0F172A'}}></div>
                                                  <h4 className="fs-6 fw-bold mb-3" style={{color: '#0F172A', lineHeight: 1.3, fontSize: '0.95rem'}}>{slide.title}</h4>

                                                  <ul className="list-unstyled mb-0 flex-fill" style={{fontSize: '0.85rem'}}>
                                                      {slide.bullets.slice(0, 5).map((b:string, i:number) => (
                                                          <li key={i} className="text-muted ps-2 border-start border-2 mb-2" style={{lineHeight: 1.4, borderColor: '#cbd5e1'}}>{b}</li>
                                                      ))}
                                                  </ul>
                                              </div>
                                              {/* Slide Number */}
                                              <div className="position-absolute bottom-0 end-0 px-2 py-1 bg-dark text-white fw-bold rounded-top-2" style={{fontSize: '0.7rem'}}>
                                                  {idx + 1}
                                              </div>
                                          </div>
                                      </div>
                                  );
                              })}
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default POS;