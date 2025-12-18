/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { BRAND_NAME } from '../constants';

interface FooterProps {
  onLinkClick: (e: React.MouseEvent, targetId: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onLinkClick }) => {
  return (
    <footer className="position-relative overflow-hidden bg-dark text-white" style={{ paddingTop: '8rem', paddingBottom: '3rem', backgroundColor: '#0F172A' }}>
      {/* Background Elements */}
      <div className="position-absolute top-0 start-0 w-100 h-100"
           style={{
             backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')",
             opacity: 0.05
           }}></div>
      <div className="position-absolute"
           style={{
             top: '-10rem',
             right: '-10rem',
             width: '24rem',
             height: '24rem',
             backgroundColor: '#4F46E5',
             opacity: 0.2,
             borderRadius: '50%',
             filter: 'blur(100px)'
           }}></div>

      <div className="container position-relative" style={{ maxWidth: '1200px', zIndex: 10 }}>
        <div className="row g-4 align-items-center mb-5 pb-5 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="col-12 col-lg-6 text-center text-lg-start">
            <h3 className="display-5 fw-black text-white mb-4">
              Your Strategy. <br/>
              <span style={{ color: '#4F46E5' }}>Automated.</span>
            </h3>
            <p className="fs-5 fw-medium mx-auto mx-lg-0" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '28rem' }}>
              Access your entire history of generated presentations in the library.
            </p>
          </div>
          <div className="col-12 col-lg-6">
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-end">
              <button
                onClick={(e) => onLinkClick(e, 'vault')}
                className="btn btn-light rounded-pill fw-black text-uppercase shadow-lg px-5 py-3"
                style={{ letterSpacing: '0.1em', fontSize: '0.75rem' }}
              >
                Open Library Feed
              </button>
            </div>
          </div>
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <div className="fw-bold text-uppercase" style={{ fontSize: '0.6875rem', letterSpacing: '0.1em' }}>
            © 2025 PDFToSlides Pro Enterprise
          </div>
          <div className="d-flex gap-4">
            <a href="#" className="text-decoration-none fw-bold" style={{ color: 'inherit', fontSize: '0.875rem' }}>Privacy</a>
            <a href="#" className="text-decoration-none fw-bold" style={{ color: 'inherit', fontSize: '0.875rem' }}>Terms</a>
            <a href="#" className="text-decoration-none fw-bold" style={{ color: 'inherit', fontSize: '0.875rem' }}>Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
