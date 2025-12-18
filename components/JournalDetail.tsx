/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


import React from 'react';
import { JournalArticle } from '../types';

interface JournalDetailProps {
  article: JournalArticle;
  onBack: () => void;
}

const JournalDetail: React.FC<JournalDetailProps> = ({ article, onBack }) => {
  return (
    <div className="min-vh-100 bg-white pt-6" style={{animation: 'fadeInUp 0.6s ease-out'}}>
       <div className="mx-auto px-3 px-md-5 pb-8" style={{maxWidth: '48rem'}}>

          <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-4">
             <button
               onClick={onBack}
               className="d-flex align-items-center gap-2 fs-6 fw-bold text-uppercase text-secondary"
               style={{letterSpacing: '0.25em', transition: 'color 0.2s'}}
               onMouseEnter={(e) => e.currentTarget.style.color = 'black'}
               onMouseLeave={(e) => e.currentTarget.style.color = ''}
             >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="transition-transform" style={{width: '1rem', height: '1rem'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-0.25rem)'} onMouseLeave={(e) => e.currentTarget.style.transform = ''}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
               </svg>
               Back to Insights
             </button>
             <span className="fs-6 fw-bold text-uppercase text-secondary" style={{letterSpacing: '0.25em'}}>{article.date}</span>
          </div>

          <h1 className="fs-1 fs-md-2 text-black mb-5 text-center" style={{fontFamily: 'serif', lineHeight: 1.1}}>
            {article.title}
          </h1>

          <div className="mx-auto fw-light text-muted" style={{lineHeight: 1.75}}>
            {article.content}
          </div>

          <div className="mt-5 pt-5 border-top d-flex justify-content-center">
              <span className="fs-3 fst-italic text-black" style={{fontFamily: 'serif'}}>Nexus</span>
          </div>
    </div>
    </div>
  );
};

export default JournalDetail;