
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

const About: React.FC = () => {
  return (
    <div className="py-5 px-3 mx-auto position-relative animate-fade-in-up" style={{ maxWidth: '1200px' }}>
       <div className="text-center mb-5 position-relative" style={{ zIndex: 10 }}>
         <span className="clay-text-convex fw-bold text-uppercase text-secondary d-block mb-4" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: '#6A4FBF' }}>The Problem</span>
         <h1 className="display-4 fw-bolder text-dark mb-4 lh-sm" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}>
           Shops still struggle with <br/> messy notebooks and manual work.
         </h1>
         <p className="fs-5 text-secondary mx-auto fw-medium" style={{ maxWidth: '48rem', lineHeight: 1.6 }}>
           Managing a business shouldn't feel like a chore. Traditional software is too complex, and paper notebooks lead to errors and lost money.
         </p>
       </div>

       <div className="row g-4 align-items-center mb-5 position-relative" style={{ zIndex: 10 }}>
          <div className="col-12 col-md-6">
            <div className="position-relative clay-card clay-img-inset" style={{ height: '500px' }}>
               <img
                 src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070&auto=format&fit=crop"
                 alt="Messy shop counter"
                 className="w-100 h-100 object-fit-cover"
                 style={{ opacity: 0.9, transition: 'transform 1s ease' }}
                 onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
               />
               <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                  <div className="clay-card p-4 bg-white shadow" style={{ transform: 'rotate(3deg)', backdropFilter: 'blur(4px)', backgroundColor: 'rgba(255,255,255,0.95)' }}>
                      <span className="fw-bold fs-5" style={{ color: '#E6007A' }}>Stop the Chaos</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
             <h3 className="h3 fw-bolder text-dark mb-4">Why merchants struggle:</h3>
             <ul className="list-unstyled">
                {[
                    { t: "No track of daily sales", d: "Hard to see where your money goes at the end of the day." },
                    { t: "No customer records", d: "Forgetting your most loyal buyers and their preferences." },
                    { t: "Messy product organization", d: "Manually checking stock is slow and frustrating." },
                    { t: "Hard to know profit or loss", d: "Guesswork instead of real business growth." },
                    { t: "Complicated software", d: "Most POS systems require days of training. We require zero." }
                ].map((item, i) => (
                    <li key={i} className="d-flex gap-3 mb-4">
                        <div className="rounded-circle d-flex flex-shrink-0 align-items-center justify-content-center text-white fw-bold"
                             style={{ width: '1.5rem', height: '1.5rem', backgroundColor: '#E6007A', fontSize: '0.75rem' }}>!</div>
                        <div>
                            <span className="d-block text-dark fw-bolder fs-6 lh-sm mb-1">{item.t}</span>
                            <span className="text-secondary fw-medium">{item.d}</span>
                        </div>
                    </li>
                ))}
             </ul>
          </div>
       </div>
    </div>
  );
};

export default About;
