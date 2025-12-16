/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useState } from 'react';

interface HeroProps {
  onStart: () => void;
  onFileSelect: (file: File) => void;
}

const Hero: React.FC<HeroProps> = ({ onStart, onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const type = file.name.split('.').pop()?.toLowerCase();
      if (type === 'pdf' || type === 'docx') {
        onFileSelect(file);
      } else {
        alert("Please select a PDF or DOCX file.");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const type = file.name.split('.').pop()?.toLowerCase();
      if (type === 'pdf' || type === 'docx') {
        onFileSelect(file);
      } else {
        alert("Strategic Engine exclusively processes PDF and DOCX formats.");
      }
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-12 overflow-hidden bg-[#F8FAFC]">
      
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-[#F1F5F9] to-[#E2E8F0]"></div>
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>

      <div className="max-w-5xl mx-auto text-center z-10 w-full animate-fade-in">
        
        <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-8 md:mb-12">
            <span className="relative flex h-2.5 w-2.5 md:h-3 md:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4F46E5] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 md:h-3 md:w-3 bg-[#4F46E5]"></span>
            </span>
            <span className="text-[10px] md:text-xs font-bold text-gray-500 tracking-widest uppercase">Enterprise Engine v3.0 • Live</span>
        </div>

        <h1 className="display-font text-4xl sm:text-6xl md:text-8xl font-black text-[#0F172A] leading-tight tracking-tight mb-6 md:mb-8 drop-shadow-sm">
            Transform Documents <br className="hidden md:block" /> into <span className="gradient-text">Strategy.</span>
        </h1>
        
        <p className="text-base md:text-xl text-gray-500 mb-10 md:mb-16 max-w-2xl mx-auto leading-relaxed font-medium px-4">
            The world's most advanced AI presentation architect. Upload raw PDFs or DOCX files and instantly generate three distinct, executive-grade PowerPoint decks.
        </p>
        
        {/* Upload Zone */}
        <div 
            className={`w-full max-w-xl mx-auto relative group transition-all duration-500 ease-out transform px-4 cursor-pointer ${isDragging ? 'scale-105' : 'scale-100 hover:scale-[1.02]'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
        >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".pdf,.docx" 
              className="hidden" 
            />
            
            {/* Main Action Button - SINGLE TAP TARGET */}
            <div 
                className={`w-full rounded-[40px] p-8 md:p-12 shadow-2xl transition-all duration-300 flex flex-col items-center justify-center gap-4 md:gap-6 border-4 ${
                    isDragging 
                    ? 'bg-[#4F46E5] border-[#4F46E5] ring-8 ring-[#4F46E5]/20' 
                    : 'bg-[#0F172A] border-[#0F172A] hover:bg-[#1E293B] hover:shadow-[0_20px_50px_rgba(15,23,42,0.3)]'
                }`}
            >
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center backdrop-blur-md border-2 transition-colors shadow-inner ${
                    isDragging ? 'bg-white/20 border-white/40' : 'bg-white/10 border-white/20'
                }`}>
                    <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                    </svg>
                </div>
                
                <div className="text-center">
                    <span className="block text-2xl md:text-4xl font-black mb-2 text-white tracking-tight">
                        {isDragging ? 'Drop to Process' : 'Upload Document'}
                    </span>
                    <span className="block text-xs md:text-sm text-gray-400 font-bold uppercase tracking-widest mt-2">
                        Single Tap • PDF or DOCX • Max 50MB
                    </span>
                </div>
            </div>

            {/* Drag & Drop Hint */}
            <div className={`hidden md:block absolute -bottom-16 left-0 w-full text-center transition-opacity duration-300 ${isDragging ? 'opacity-0' : 'opacity-100'}`}>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Drag & Drop Supported</span>
            </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;