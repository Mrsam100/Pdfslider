/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FEATURES } from '../constants';

const Learn: React.FC = () => {
  return (
    <section className="py-6 px-3 mx-auto mb-5 shadow-sm border" style={{maxWidth: '1200px', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: '60px'}}>
      <div className="text-center mb-5">
        <span className="clay-text-convex fs-6 fw-bold text-uppercase mb-3" style={{letterSpacing: '0.25em', color: '#2AB9A9'}}>The Solution</span>
        <h1 className="fs-1 fs-md-2 fw-bolder mb-3" style={{color: '#4A4A4A'}}>One Simple App for Any Small Business</h1>
        <p className="fs-5 text-muted mx-auto fw-medium" style={{maxWidth: '42rem'}}>
            We built ShopSmart to be so easy that anyone can start selling in seconds.
            Powerful features, simplified for the real world.
        </p>
      </div>

      <div className="row g-4">
        {FEATURES.map((feat, idx) => (
           <div key={idx} className="col-12 col-md-6 col-lg-3 clay-card p-4 d-flex flex-column align-items-start cursor-default group" style={{transition: 'transform 0.2s', minHeight: '280px'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-0.5rem)'} onMouseLeave={(e) => e.currentTarget.style.transform = ''}>
               <div className="rounded-3 d-flex align-items-center justify-content-center text-white fs-2 mb-3 shadow border" style={{width: '3.5rem', height: '3.5rem', backgroundColor: feat.color}}>
                  {feat.icon}
               </div>
               <h3 className="fs-4 fw-bolder mb-2" style={{color: '#4A4A4A', lineHeight: 1.1}}>{feat.title}</h3>
               <p className="fs-6 text-muted fw-medium" style={{lineHeight: 1.625}}>{feat.desc}</p>
           </div>
        ))}
      </div>

      <div className="mt-5 d-flex flex-column flex-md-row align-items-center justify-content-center gap-5 border-top pt-5">
          <div className="text-center text-md-start">
              <h4 className="fs-3 fw-bold mb-2" style={{color: '#4A4A4A'}}>Supports All Payments</h4>
              <p className="text-muted fw-medium">Cash, Card, QR codes, and digital wallets.</p>
          </div>
          <div className="d-flex gap-3">
              {['Cash', 'Visa', 'QR', 'Mobile'].map(p => (
                  <div key={p} className="rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center fs-6 fw-bold text-secondary border" style={{width: '3rem', height: '3rem'}}>
                      {p}
                  </div>
              ))}
          </div>
      </div>
    </section>
  );
};

export default Learn;
