/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { validationService } from '../services/validationService';

interface HeroProps {
  onFileSelect: (file: File) => void;
}

const Hero: React.FC<HeroProps> = ({ onFileSelect }) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const validateAndProcessFile = (file: File): boolean => {
    // Use validation service for comprehensive file validation
    const validation = validationService.validateFile(file, {
      maxSize: 50 * 1024 * 1024, // 50MB
      allowedTypes: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
      ],
      allowedExtensions: ['pdf', 'docx']
    });

    if (!validation.valid) {
      showToast(validation.error || 'Invalid file. Please select a valid PDF or DOCX file.', 'error');
      return false;
    }

    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateAndProcessFile(file)) {
      setIsProcessing(true);
      try {
        await onFileSelect(file);
      } finally {
        setIsProcessing(false);
      }
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && validateAndProcessFile(file)) {
      setIsProcessing(true);
      try {
        await onFileSelect(file);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <section className="position-relative min-vh-100 d-flex flex-column align-items-center justify-content-center px-3 overflow-hidden"
             style={{ paddingTop: '5rem', paddingBottom: '3rem', backgroundColor: '#ffffff' }}>

      <div className="container" style={{ maxWidth: '900px', zIndex: 10 }}>
        <div className="text-center animate-fade-in">

          {/* Logo/Brand */}
          <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
            <div className="bg-dark d-flex align-items-center justify-content-center"
                 style={{ width: '48px', height: '48px' }}>
              <span className="fw-black text-white" style={{ fontSize: '24px' }}>P</span>
            </div>
            <span className="fw-bold text-dark" style={{ fontSize: '20px', letterSpacing: '0.1em' }}>PDFSLIDER</span>
          </div>

          <h1 className="display-1 fw-black text-dark mb-2"
              style={{
                lineHeight: 1,
                letterSpacing: '-0.02em',
                fontSize: 'clamp(3rem, 8vw, 6rem)'
              }}>
            PDF
          </h1>
          <h1 className="display-1 fw-black text-dark mb-4"
              style={{
                lineHeight: 1,
                letterSpacing: '-0.02em',
                fontSize: 'clamp(3rem, 8vw, 6rem)',
                textDecoration: 'underline',
                textDecorationThickness: '8px',
                textUnderlineOffset: '8px'
              }}>
            SLIDER.
          </h1>

          <p className="text-dark mb-4 mx-auto fw-normal px-3"
             style={{
               maxWidth: '32rem',
               lineHeight: 1.6,
               fontSize: '1rem',
               letterSpacing: '0.05em'
             }}>
            DROP ANY DOCUMENT. RECEIVE A<br/>
            BEAUTIFULLY DESIGNED, SHAREABLE,<br/>
            ONE-PAGE DISTILLATION INSTANTLY. NO<br/>
            NOISE. JUST THE ESSENCE.
          </p>

          {/* Upload Zone */}
          <div
            className={`mx-auto position-relative transition-all ${isDragging ? '' : ''}`}
            style={{
              maxWidth: '36rem',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              transform: isDragging ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.5s ease',
              opacity: isProcessing ? 0.7 : 1
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={isProcessing ? undefined : handleUploadClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx"
              className="d-none"
              aria-label="Upload PDF or DOCX file"
              id="file-upload-input"
            />

            {/* Main Action Button */}
            <button
              disabled={isProcessing}
              type="button"
              aria-label={isProcessing ? 'Processing file, please wait' : isDragging ? 'Drop file here' : 'Click to upload PDF or DOCX file'}
              aria-busy={isProcessing}
              className={`w-100 p-4 d-flex flex-column align-items-center justify-content-center gap-3 border ${
                isDragging ? 'border-dark bg-dark' : 'border-dark'
              }`}
              style={{
                backgroundColor: isDragging ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                borderWidth: '2px',
                borderRadius: '0',
                transition: 'all 0.3s ease',
                maxWidth: '400px',
                margin: '0 auto'
              }}
            >
              <div className="text-center">
                <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                  {isProcessing ? (
                    <div className="spinner" style={{ width: '32px', height: '32px' }}></div>
                  ) : (
                    <div className="bg-dark d-flex align-items-center justify-content-center"
                         style={{ width: '32px', height: '32px' }}>
                      <span className="fw-black text-white" style={{ fontSize: '16px' }}>P</span>
                    </div>
                  )}
                </div>
                <span className="d-block fw-bold text-dark mb-2"
                      style={{
                        fontSize: '1.25rem',
                        letterSpacing: '0.1em'
                      }}>
                  {isProcessing ? 'PROCESSING...' : isDragging ? 'DROP HERE' : 'START'}
                </span>
                <span className="d-block text-dark"
                      style={{
                        fontSize: '0.75rem',
                        letterSpacing: '0.05em',
                        opacity: 0.7
                      }}>
                  PDF OR DOCX • MAX 50MB
                </span>
              </div>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
