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
    <footer className="position-relative overflow-hidden text-dark border-top" style={{ paddingTop: '4rem', paddingBottom: '2rem', backgroundColor: '#ffffff', borderColor: '#e0e0e0 !important' }}>
      <div className="container position-relative" style={{ maxWidth: '1200px', zIndex: 10 }}>
        <div className="row g-4 align-items-center mb-4 pb-4 border-bottom" style={{ borderColor: '#e0e0e0 !important' }}>
          <div className="col-12 col-lg-6 text-center text-lg-start">
            <h3 className="fw-black text-dark mb-3" style={{ fontSize: '2rem', letterSpacing: '0.05em' }}>
              YOUR LIBRARY.<br/>
              DISTILLED.
            </h3>
            <p className="fw-normal mx-auto mx-lg-0" style={{ color: 'rgba(0,0,0,0.6)', maxWidth: '28rem', letterSpacing: '0.05em' }}>
              Access your entire history of generated presentations.
            </p>
          </div>
          <div className="col-12 col-lg-6">
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-end">
              <button
                onClick={(e) => onLinkClick(e, 'vault')}
                className="btn border border-dark text-dark fw-bold text-uppercase px-5 py-3"
                style={{ letterSpacing: '0.1em', fontSize: '0.75rem', backgroundColor: 'transparent', borderRadius: 0 }}
              >
                OPEN LIBRARY
              </button>
            </div>
          </div>
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-4" style={{ color: 'rgba(0,0,0,0.4)' }}>
          <div className="fw-bold text-uppercase" style={{ fontSize: '0.6875rem', letterSpacing: '0.15em' }}>
            © 2025 PDFSLIDER
          </div>
          <div className="d-flex gap-4">
            <a href="#" className="text-decoration-none fw-bold text-uppercase" style={{ color: 'inherit', fontSize: '0.75rem', letterSpacing: '0.1em' }}>PRIVACY</a>
            <a href="#" className="text-decoration-none fw-bold text-uppercase" style={{ color: 'inherit', fontSize: '0.75rem', letterSpacing: '0.1em' }}>TERMS</a>
            <a href="#" className="text-decoration-none fw-bold text-uppercase" style={{ color: 'inherit', fontSize: '0.75rem', letterSpacing: '0.1em' }}>CONTACT</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
