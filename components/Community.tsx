/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

const Community: React.FC = () => {
  return (
    <section className="px-4 mx-auto min-vh-100 d-flex flex-column justify-content-center" style={{paddingTop: '6rem', paddingBottom: '6rem', maxWidth: '1200px'}}>
      <div className="text-center mb-5">
        <span className="clay-text-convex fs-6 fw-bold text-uppercase mb-3" style={{letterSpacing: '0.25em', color: '#6A4FBF'}}>Partner With Us</span>
        <h1 className="fs-1 fs-md-2 fw-bolder mb-3" style={{color: '#4A4A4A', lineHeight: 1.1}}>Earn Money by Selling Our App</h1>
        <p className="fs-4 text-muted mx-auto fw-medium" style={{maxWidth: '42rem'}}>
            Anyone can become a reseller. Show the app to local shops and earn a commission for each signup.
        </p>
      </div>

      <div className="row g-4 mb-5">
          {[
              { t: "Show & Sell", d: "Simply demonstrate the app to local merchants.", i: "📱" },
              { t: "Help Onboard", d: "Help them set up their first 5 products.", i: "🤝" },
              { t: "Earn Commissions", d: "Get paid for every merchant that subscribes.", i: "💰" },
          ].map((item, idx) => (
              <div key={idx} className="col-12 col-md-6 col-lg-4">
                  <div className="clay-card p-5 d-flex flex-column align-items-center text-center" style={{transition: 'transform 0.2s'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = ''}>
                      <div className="fs-1 mb-3">{item.i}</div>
                      <h3 className="fw-bolder fs-3 mb-2" style={{color: '#4A4A4A'}}>{item.t}</h3>
                      <p className="text-muted fw-medium">{item.d}</p>
                  </div>
              </div>
          ))}
      </div>

      <div className="clay-card p-5 text-white text-center position-relative overflow-hidden" style={{backgroundColor: '#6A4FBF'}}>
          <div className="position-relative" style={{zIndex: 10}}>
              <h3 className="fs-1 fw-bolder mb-3">Start Your Business Today</h3>
              <p className="mb-4 mx-auto fs-5 fw-medium" style={{color: 'rgba(255,255,255,0.8)', maxWidth: '42rem'}}>
                  We provide the training, the materials, and the app. You provide the local connections.
                  Perfect for students, freelancers, or anyone looking for extra income.
              </p>
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                  <button className="px-5 py-3 rounded-pill bg-white fw-bolder shadow" style={{color: '#6A4FBF', transition: 'transform 0.2s', fontSize: '1.25rem'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = ''}>
                      Become a Reseller
                  </button>
                  <button className="px-5 py-3 rounded-pill bg-transparent border border-2 fw-bolder" style={{borderColor: 'rgba(255,255,255,0.3)', color: 'white', transition: 'background-color 0.2s', fontSize: '1.25rem'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      Download Seller Guide
                  </button>
              </div>
          </div>

          <div className="position-absolute rounded-circle opacity-10" style={{top: '-5rem', left: '-5rem', width: '16rem', height: '16rem', backgroundColor: 'white', filter: 'blur(64px)'}}></div>
          <div className="position-absolute rounded-circle opacity-25" style={{bottom: '-5rem', right: '-5rem', width: '20rem', height: '20rem', backgroundColor: '#FFB673', filter: 'blur(64px)', mixBlendMode: 'screen'}}></div>
      </div>
    </section>
  );
};

export default Community;
