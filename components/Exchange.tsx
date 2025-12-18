/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

const Exchange: React.FC = () => {
  return (
    <div className="py-6 px-4 bg-white border-top">
      <div className="mx-auto" style={{maxWidth: '1200px'}}>
          <div className="text-center mb-5">
              <span className="fs-6 fw-bold text-uppercase d-block mb-2" style={{letterSpacing: '0.25em', color: '#6366F1'}}>The Pipeline</span>
              <h2 className="fs-2 fs-md-1 fw-bold" style={{color: '#111827'}}>Intelligent Reconstruction</h2>
          </div>

          <div className="row g-4">
              {[
                  { n: "01", t: "Ingest", d: "Deep XML parsing of source PDF/DOCX structure." },
                  { n: "02", t: "Deconstruct", d: "Identification of headers, figures, and key text blocks." },
                  { n: "03", t: "Synthesize", d: "Gemini 2.5 Pro generates strategic slide narratives." },
                  { n: "04", t: "Render", d: "Vector-perfect export to native PowerPoint formats." }
              ].map(step => (
                  <div key={step.n} className="col-12 col-md-3">
                      <div className="clay-card p-4 border" style={{backgroundColor: 'rgba(255,255,255,0.5)', transition: 'border-color 0.2s'}} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = ''}>
                          <div className="fs-1 fw-bolder text-light mb-3">{step.n}</div>
                          <h3 className="fw-bold fs-5 mb-2" style={{color: '#111827'}}>{step.t}</h3>
                          <p className="fs-6 text-muted fw-medium" style={{lineHeight: 1.625}}>{step.d}</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default Exchange;