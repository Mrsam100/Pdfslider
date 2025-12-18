/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ConversionLog, ConversionJob } from '../types';

interface ConversionInsightsProps {
  sales: ConversionLog[];
  products: ConversionJob[];
}

const Reports: React.FC<ConversionInsightsProps> = ({ sales, products }) => {
  const totalPages = products.reduce((acc, p) => acc + p.pageCount, 0);
  const avgPages = products.length > 0 ? Math.round(totalPages / products.length) : 0;

  return (
    <div className="pt-8 pb-6 px-3 mx-auto" style={{maxWidth: '1200px', animation: 'fadeIn 0.6s ease-out'}}>
      <div className="mb-5">
          <span className="clay-text-convex fs-6 fw-bolder text-uppercase mb-2" style={{letterSpacing: '0.25em', color: '#6A4FBF'}}>System Efficiency</span>
          <h1 className="fs-1 fw-bolder" style={{color: '#4A4A4A'}}>Conversion Analytics</h1>
      </div>

      <div className="row g-4 mb-5">
          <div className="col-12 col-sm-6 col-lg-3 clay-card p-5 text-white shadow" style={{backgroundColor: '#6A4FBF', transform: 'scale(1.05)', transition: 'transform 0.2s'}}>
              <span className="fs-6 fw-bolder text-uppercase d-block mb-2 opacity-50">Total Pages Processed</span>
              <div className="fs-1 fw-bolder" style={{letterSpacing: '-0.05em'}}>{totalPages}</div>
              <div className="mt-3 fs-6 fw-bolder text-uppercase opacity-30" style={{letterSpacing: '0.25em'}}>Across All Jobs</div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3 clay-card p-5 bg-white shadow">
              <span className="fs-6 fw-bolder text-uppercase text-light d-block mb-2">Avg Deck Size</span>
              <div className="fs-1 fw-bolder" style={{color: '#4A4A4A', letterSpacing: '-0.05em'}}>
                {avgPages}
              </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3 clay-card p-5 shadow" style={{backgroundColor: '#FFD447', color: '#1c1917'}}>
              <span className="fs-6 fw-bolder text-uppercase d-block mb-2 opacity-40">Storage Saved</span>
              <div className="fs-1 fw-bolder" style={{letterSpacing: '-0.05em'}}>
                1.2 GB
              </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3 clay-card p-5 text-white shadow" style={{backgroundColor: '#2AB9A9'}}>
              <span className="fs-6 fw-bolder text-uppercase d-block mb-2 opacity-50">Extraction Accuracy</span>
              <div className="fs-1 fw-bolder" style={{letterSpacing: '-0.05em'}}>
                99.8%
              </div>
          </div>
      </div>

      <div className="clay-card p-5 border border-4 shadow" style={{backgroundColor: 'rgba(255,255,255,0.9)'}}>
          <h3 className="fs-2 fw-bolder mb-4" style={{color: '#4A4A4A'}}>Export Format Distribution</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              {[
                  { name: 'PowerPoint (PPTX)', count: products.filter(p => p.format === 'PPTX').length, color: '#D04423' },
                  { name: 'Google Slides', count: products.filter(p => p.format === 'Google Slides').length, color: '#FBBC04' },
                  { name: 'Other Formats', count: products.filter(p => p.format !== 'PPTX' && p.format !== 'Google Slides').length, color: '#6A4FBF' }
              ].map(i => (
                  <div key={i.name}>
                      <div className="d-flex justify-content-between fs-6 fw-bolder text-uppercase mb-2" style={{letterSpacing: '0.25em'}}>
                          <span>{i.name}</span>
                          <span>{i.count} decks</span>
                      </div>
                      <div className="w-100 rounded-pill overflow-hidden shadow-sm" style={{height: '16px', backgroundColor: '#f8f9fa'}}>
                          <div className="h-100 rounded-pill transition-all" style={{width: `${products.length > 0 ? (i.count / products.length) * 100 : 0}%`, backgroundColor: i.color, transitionDuration: '1000ms'}}></div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default Reports;
