/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useState, useEffect } from 'react';
import { ConversionJob } from '../types';

interface StudioProps {
  feed: ConversionJob[];
  onArchive: (job: ConversionJob) => void;
  onExport: (job: ConversionJob, variantId?: string) => void;
  onFileSelect: (file: File) => void;
  shopName: string;
}

const POS: React.FC<StudioProps> = ({ feed, onArchive, onExport, onFileSelect, shopName }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedJob, setSelectedJob] = useState<ConversionJob | null>(null);
  const [activeVariantId, setActiveVariantId] = useState<string>('v1'); 

  const processFile = (file: File | null) => {
    if (!file) return;
    const type = file.name.split('.').pop()?.toLowerCase();
    if (type === 'pdf' || type === 'docx') {
      onFileSelect(file);
    } else {
      alert("Strategic Engine exclusively processes PDF and DOCX formats.");
    }
  };

  const handleOpenPreview = (job: ConversionJob) => {
      setSelectedJob(job);
      setActiveVariantId(job.variants?.[0]?.id || 'v1');
  };

  // Get current variant's slides
  const activeSlides = selectedJob?.variants?.find(v => v.id === activeVariantId)?.slides || [];

  return (
    <div className="max-w-[1920px] mx-auto p-4 md:p-8 min-h-[calc(100vh-80px)] flex flex-col xl:flex-row gap-8 bg-[#F8FAFC]">
      
      {/* LEFT PANEL: UPLOAD & WORKSPACE */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        {/* Workspace Card */}
        <div className="clay-card p-6 md:p-8 bg-white flex flex-col relative overflow-hidden shadow-xl border-t-4 border-[#4F46E5]">
             <div className="mb-8">
                 <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 block">Active Workspace</span>
                 <h2 className="text-2xl md:text-3xl font-black text-[#0F172A] truncate">{shopName || 'Executive Studio'}</h2>
             </div>

             {/* Upload Zone */}
             <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFile(e.dataTransfer.files?.[0]); }}
                className={`flex-1 min-h-[250px] md:min-h-[300px] border-4 border-dashed rounded-3xl flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer group relative overflow-hidden ${isDragging ? 'border-[#4F46E5] bg-[#4F46E5]/5 scale-[0.98]' : 'border-gray-200 hover:border-[#4F46E5] hover:bg-gray-50'}`}
                onClick={() => fileInputRef.current?.click()}
             >
                 {/* Decorative background circle */}
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#4F46E5] opacity-[0.03] rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>

                 <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 shadow-lg transition-transform group-hover:scale-110 z-10 ${isDragging ? 'bg-[#4F46E5] text-white' : 'bg-white text-[#4F46E5] border border-gray-100'}`}>
                    <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                 </div>
                 <h3 className="text-lg md:text-xl font-bold text-[#0F172A] mb-2 z-10">Start New Project</h3>
                 <p className="text-xs md:text-sm text-gray-500 mb-6 md:mb-8 max-w-[200px] mx-auto font-medium z-10">Drag PDF/DOCX here or click to browse.</p>
                 <button className="px-6 py-2 bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wide rounded-lg shadow-md group-hover:bg-[#000000] z-10">Upload File</button>
             </div>
             
             <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => processFile(e.target.files?.[0] || null)} 
                accept=".pdf,.docx" 
                className="hidden" 
              />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
             <div className="clay-card p-4 md:p-6 bg-white hover:border-[#4F46E5] cursor-pointer group transition-all">
                 <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                 </div>
                 <h4 className="font-bold text-[#0F172A] text-xs md:text-sm">Templates</h4>
                 <p className="text-[10px] text-gray-400 font-bold uppercase">Browse Styles</p>
             </div>
             <div className="clay-card p-4 md:p-6 bg-white hover:border-[#4F46E5] cursor-pointer group transition-all">
                 <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                 </div>
                 <h4 className="font-bold text-[#0F172A] text-xs md:text-sm">Analytics</h4>
                 <p className="text-[10px] text-gray-400 font-bold uppercase">Usage Stats</p>
             </div>
        </div>
      </div>

      {/* RIGHT PANEL: GENERATED DECKS & PREVIEW */}
      <div className="w-full xl:w-2/3 flex flex-col gap-6">
          <div className="flex items-center justify-between px-2 py-2">
              <h3 className="text-xl md:text-2xl font-black text-[#0F172A]">Recent Projects</h3>
              <button className="text-xs font-bold text-[#4F46E5] hover:underline">View All History</button>
          </div>

          <div className="grid grid-cols-1 gap-6">
              {feed.length === 0 ? (
                  <div className="clay-card p-8 md:p-16 text-center flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px] border-dashed border-2 border-gray-200">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-3xl grayscale opacity-30 animate-pulse">✨</div>
                      <h4 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Studio Empty</h4>
                      <p className="text-sm text-gray-500 font-medium">Upload a document to generate your first strategic deck.</p>
                  </div>
              ) : (
                  feed.map(job => (
                      <div key={job.id} className="clay-card p-0 bg-white flex flex-col md:flex-row items-stretch overflow-hidden group hover:shadow-2xl transition-all duration-300">
                          {/* Thumbnail */}
                          <div className="w-full md:w-64 h-48 md:h-auto bg-gray-100 relative shrink-0 cursor-pointer overflow-hidden" onClick={() => handleOpenPreview(job)}>
                              <img src={job.thumbnailUrl} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" alt="Cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                  <span className="text-white text-[10px] font-bold uppercase tracking-widest border border-white/30 px-2 py-1 rounded backdrop-blur-md">Preview</span>
                              </div>
                          </div>
                          
                          <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-lg md:text-xl font-bold text-[#0F172A] hover:text-[#4F46E5] cursor-pointer transition-colors" onClick={() => handleOpenPreview(job)}>{job.title}</h4>
                                    <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded uppercase tracking-widest shrink-0 ml-2">Done</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs font-medium text-gray-400 mb-6">
                                    <span>{job.originalFileName}</span>
                                    <span className="hidden md:inline">•</span>
                                    <span>{job.pageCount} Slides</span>
                                    <span className="hidden md:inline">•</span>
                                    <span className="bg-[#4F46E5]/10 text-[#4F46E5] px-2 py-0.5 rounded-full font-bold">3 Unique Decks Ready</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                  <button 
                                    onClick={() => handleOpenPreview(job)}
                                    className="px-5 py-2.5 bg-[#0F172A] text-white text-xs font-bold rounded-lg shadow-lg hover:bg-black transition-all flex items-center gap-2"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                    View Files
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
          <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-0 md:p-4 animate-fade-in">
              <div className="bg-[#F8FAFC] w-full max-w-7xl h-full md:h-[90vh] rounded-none md:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-modal">
                  {/* Header */}
                  <div className="bg-white px-6 md:px-8 py-5 border-b border-gray-200 flex justify-between items-center shrink-0">
                      <div>
                          <h3 className="text-xl md:text-2xl font-black text-[#0F172A] truncate max-w-[200px] md:max-w-md">{selectedJob.title}</h3>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Ready for Download</p>
                      </div>
                      <button 
                          onClick={() => setSelectedJob(null)}
                          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                       >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                       </button>
                  </div>

                  <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                      {/* Sidebar: Download Center */}
                      <div className="w-full lg:w-96 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 p-4 md:p-6 flex flex-row lg:flex-col gap-4 shrink-0 overflow-x-auto lg:overflow-y-auto no-scrollbar">
                          
                          <div className="hidden lg:flex items-center gap-3 mb-2 p-3 bg-gray-50 rounded-xl">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <div>
                                    <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-widest">Download Center</h4>
                                    <p className="text-[10px] text-gray-500 font-medium">3 Unique Decks Generated</p>
                                </div>
                          </div>

                          {selectedJob.variants?.map(variant => (
                              <div key={variant.id} className="flex-none w-64 lg:w-full relative group">
                                  {/* Card */}
                                  <div 
                                    className={`p-4 md:p-5 rounded-2xl border-2 transition-all cursor-pointer h-full flex flex-col justify-between ${
                                        activeVariantId === variant.id 
                                        ? 'border-[#4F46E5] bg-[#4F46E5]/5 shadow-md' 
                                        : 'border-gray-100 hover:border-gray-300 bg-white hover:bg-gray-50'
                                    }`}
                                    onClick={() => setActiveVariantId(variant.id)}
                                  >
                                      <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg shadow-sm flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: variant.color }}>
                                                PPTX
                                            </div>
                                            <span className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-400">
                                               {variant.slides.length} slides
                                            </span>
                                        </div>
                                        
                                        <h5 className="font-bold text-[#0F172A] text-sm mb-1">{variant.name}</h5>
                                        <p className="text-[10px] text-gray-500 mb-4 line-clamp-2">
                                            {variant.id === 'v1' ? 'Strategic overview focused on ROI.' : 
                                             variant.id === 'v2' ? 'Narrative-driven storytelling.' : 'Data-heavy technical specifications.'}
                                        </p>
                                      </div>
                                      
                                      {/* Individual Download Button */}
                                      <button 
                                          onClick={(e) => { e.stopPropagation(); onExport(selectedJob, variant.id); }}
                                          className="w-full py-2 bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-sm"
                                      >
                                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                          Download
                                      </button>
                                  </div>
                              </div>
                          ))}
                      </div>

                      {/* Main Preview Area */}
                      <div className="flex-1 bg-[#F1F5F9] p-4 md:p-8 overflow-y-auto">
                          <div className="max-w-5xl mx-auto pb-10">
                              <div className="mb-6 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md" style={{ backgroundColor: selectedJob.variants?.find(v => v.id === activeVariantId)?.color }}>
                                         {selectedJob.variants?.find(v => v.id === activeVariantId)?.name.charAt(0)}
                                      </div>
                                      <h4 className="font-bold text-[#0F172A] text-base md:text-lg">
                                         {selectedJob.variants?.find(v => v.id === activeVariantId)?.name} <span className="text-gray-400 font-medium text-sm">Preview</span>
                                      </h4>
                                  </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                  {activeSlides.map((slide, idx) => {
                                      const hasImage = !!(slide.imagePrompt && slide.imagePrompt.trim().length > 0);
                                      
                                      return (
                                          <div key={idx} className={`bg-white aspect-[16/9] rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col relative group hover:scale-[1.02] transition-transform duration-300 ${activeVariantId === 'v1' ? 'font-sans' : activeVariantId === 'v2' ? 'font-serif' : 'font-mono'}`}>
                                              {/* Slide Mockup Content */}
                                              <div className="flex-1 p-4 md:p-8 flex flex-col scale-[0.85] md:scale-[0.8] origin-top-left w-[117%] md:w-[125%] h-[117%] md:h-[125%]">
                                                  <div className={`h-2 w-16 md:w-24 mb-4 md:mb-6 rounded-full ${activeVariantId === 'v1' ? 'bg-[#0F172A]' : activeVariantId === 'v2' ? 'bg-[#4C1D95]' : 'bg-black'}`}></div>
                                                  <h4 className="text-xl md:text-3xl font-bold text-[#0F172A] mb-2 md:mb-4 leading-tight line-clamp-2">{slide.title}</h4>
                                                  
                                                  <ul className="space-y-2 md:space-y-4 mb-4 md:mb-6">
                                                      {slide.bullets.slice(0, hasImage ? 3 : 6).map((b:string, i:number) => (
                                                          <li key={i} className="text-sm md:text-xl text-gray-600 leading-snug pl-4 border-l-4 border-gray-100 line-clamp-2">{b}</li>
                                                      ))}
                                                  </ul>
                                                  
                                                  {/* Visualization or Image Preview - Conditional */}
                                                  {hasImage && (
                                                      <div className="mt-auto h-24 md:h-32 rounded-xl bg-gray-100 overflow-hidden relative">
                                                          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-400 uppercase tracking-widest z-10 bg-white/50 backdrop-blur-sm">
                                                              AI Generated Visual
                                                          </div>
                                                          <img 
                                                              src={`https://image.pollinations.ai/prompt/${encodeURIComponent(slide.imagePrompt)}?width=400&height=200&nologo=true`}
                                                              className="w-full h-full object-cover opacity-50"
                                                              alt="AI Generated"
                                                              loading="lazy"
                                                          />
                                                      </div>
                                                  )}
                                              </div>
                                              <div className="absolute bottom-4 right-6 text-xs font-bold text-gray-300">
                                                  Slide {idx + 1}
                                              </div>
                                          </div>
                                      );
                                  })}
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default POS;