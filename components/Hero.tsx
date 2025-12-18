/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useState } from 'react';
import { useToast } from '../contexts/ToastContext';

interface HeroProps {
  onFileSelect: (file: File) => void;
}

const Hero: React.FC<HeroProps> = ({ onFileSelect }) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const validateAndProcessFile = (file: File): boolean => {
    // Validate file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'pdf' && extension !== 'docx') {
      showToast("Please select a PDF or DOCX file.", 'error');
      return false;
    }

    // Validate MIME type for additional security
    const validMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword' // For older .doc files if they're renamed to .docx
    ];

    if (!validMimeTypes.includes(file.type)) {
      showToast(`Invalid file type: ${file.type}. Please select a valid PDF or DOCX file.`, 'error');
      return false;
    }

    // Validate file size (max 50MB)
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_FILE_SIZE) {
      showToast(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size is 50MB.`, 'error');
      return false;
    }

    // Check for minimum file size (avoid empty files)
    if (file.size < 100) { // 100 bytes minimum
      showToast("File appears to be empty or corrupted.", 'error');
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateAndProcessFile(file)) {
      onFileSelect(file);
    }
    // Reset input to allow re-selecting the same file
    if (e.target) e.target.value = '';
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
    if (file && validateAndProcessFile(file)) {
      onFileSelect(file);
    }
  };

  return (
    <section className="position-relative min-vh-100 d-flex flex-column align-items-center justify-content-center px-3 overflow-hidden"
             style={{ paddingTop: '5rem', paddingBottom: '3rem', backgroundColor: '#F8FAFC' }}>

      {/* Background */}
      <div className="position-absolute top-0 start-0 w-100 h-100"
           style={{
             zIndex: -1,
             background: 'radial-gradient(ellipse at center, #ffffff 0%, #F1F5F9 50%, #E2E8F0 100%)'
           }}></div>
      <div className="position-absolute top-0 start-0 w-100 h-100"
           style={{
             opacity: 0.03,
             backgroundImage: "url('https://www.transparenttextures.com/patterns/graphy.png')"
           }}></div>

      <div className="container" style={{ maxWidth: '900px', zIndex: 10 }}>
        <div className="text-center animate-fade-in">

          <h1 className="display-1 fw-black text-dark mb-3 mb-md-4" style={{ lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Upload PDF, <span className="gradient-text">Get Slides</span>
          </h1>

          <p className="fs-5 text-secondary mb-5 mx-auto fw-medium px-3" style={{ maxWidth: '42rem', lineHeight: 1.6 }}>
            Convert your documents into presentation slides instantly.
          </p>

          {/* Upload Zone */}
          <div
            className={`mx-auto position-relative transition-all ${isDragging ? '' : ''}`}
            style={{
              maxWidth: '36rem',
              cursor: 'pointer',
              transform: isDragging ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.5s ease'
            }}
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
              className="d-none"
            />

            {/* Main Action Button */}
            <div
              className={`w-100 rounded-5 p-4 p-md-5 shadow d-flex flex-column align-items-center justify-content-center gap-3 gap-md-4 border border-4 ${
                isDragging
                  ? 'bg-primary border-primary'
                  : 'bg-dark border-dark'
              }`}
              style={{
                borderRadius: '40px',
                transition: 'all 0.3s ease',
                boxShadow: isDragging ? '0 0 0 8px rgba(79, 70, 229, 0.2)' : '0 20px 50px rgba(15, 23, 42, 0.3)'
              }}
            >
              <div className={`rounded-circle d-flex align-items-center justify-content-center border border-2 shadow-sm ${
                isDragging ? 'bg-white bg-opacity-25 border-white border-opacity-50' : 'bg-white bg-opacity-10 border-white border-opacity-25'
              }`}
                   style={{ width: '5rem', height: '5rem', backdropFilter: 'blur(10px)' }}>
                <svg style={{ width: '2.5rem', height: '2.5rem' }} className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                </svg>
              </div>

              <div className="text-center">
                <span className="d-block display-6 fw-black mb-2 text-white" style={{ letterSpacing: '-0.02em' }}>
                  {isDragging ? 'Drop Here' : 'Choose File'}
                </span>
                <span className="d-block text-secondary fw-medium" style={{ fontSize: '0.875rem', color: '#CBD5E1' }}>
                  PDF or DOCX • Max 50MB
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
