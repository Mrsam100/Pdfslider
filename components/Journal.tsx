/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


import React from 'react';
import { JOURNAL_ARTICLES } from '../constants';
import { JournalArticle } from '../types';

interface JournalProps {
  onArticleClick: (article: JournalArticle) => void;
}

const Journal: React.FC<JournalProps> = ({ onArticleClick }) => {
  return (
    <section id="journal" className="bg-white py-8 px-3 px-md-5 border-top">
      <div className="mx-auto" style={{maxWidth: '1800px'}}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-5 pb-4 border-bottom">
            <div>
                <span className="d-block fs-6 fw-bold text-uppercase text-secondary mb-3" style={{letterSpacing: '0.2em'}}>Editorial</span>
                <h2 className="fs-1 fs-md-2 text-black" style={{fontFamily: 'serif'}}>Research Insights</h2>
            </div>
        </div>

        <div className="row g-5">
            {JOURNAL_ARTICLES.map((article) => (
                <div key={article.id} className="col-12 col-md-4 group cursor-pointer d-flex flex-column text-start p-3 border" style={{transition: 'border-color 0.2s'}} onClick={() => onArticleClick(article)} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'black'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#dee2e6'}>
                    <div className="d-flex flex-column flex-fill text-start">
                        <span className="fs-6 fw-bold text-uppercase text-secondary mb-3" style={{letterSpacing: '0.25em'}}>{article.date}</span>
                        <h3 className="fs-3 text-black mb-3" style={{fontFamily: 'serif', lineHeight: 1.1, textDecoration: 'none', textDecorationThickness: '1px', textUnderlineOffset: '4px'}} onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}>{article.title}</h3>
                        <p className="text-muted fw-light" style={{lineHeight: 1.625}}>{article.excerpt}</p>

                        <div className="mt-4 fs-6 fw-bold text-uppercase text-black" style={{letterSpacing: '0.25em', textDecoration: 'underline', textDecorationThickness: '1px', textUnderlineOffset: '4px'}}>Read Article</div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Journal;