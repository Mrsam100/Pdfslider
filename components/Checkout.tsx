/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Paper } from '../types';

interface CheckoutProps {
  onBack: () => void;
  onSubmit: (paper: Paper) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    publisher: '',
    link: '',
    description: '',
    category: '',
    year: new Date().getFullYear().toString()
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.publisher || !formData.link || !formData.description) {
        setErrorMessage("Please fill out all required fields.");
        return;
    }

    // Character limit validation
    if (formData.description.length < 50) {
        setErrorMessage("Description is too short. Please provide historical context.");
        return;
    }

    // Fix: Added 'readTime' property to match the required structure of the Paper interface
    const finalReport: Paper = {
        id: `sub-${Date.now()}`,
        title: formData.title,
        publisher: formData.publisher,
        authors: [formData.publisher],
        abstract: formData.description,
        abstractPreview: formData.description.substring(0, 150) + "...",
        publicationDate: formData.year,
        category: formData.category || "General",
        doi: formData.link,
        whyMatters: "Community submission pending peer review.",
        upvotes: 1,
        timestamp: Date.now(),
        aiInsights: ["Analysis pending..."],
        publisherLogo: "US",
        readTime: "Research"
    };

    onSubmit(finalReport);
  };

  return (
    <div className="min-vh-100 px-4 bg-white" style={{paddingTop: '6rem', paddingBottom: '6rem', animation: 'fadeInUp 0.6s ease-out'}}>
      <div className="mx-auto" style={{maxWidth: '42rem'}}>
        <button
          onClick={onBack}
          className="d-flex align-items-center gap-2 fs-6 fw-bold text-uppercase text-secondary mb-5"
          style={{letterSpacing: '0.25em', transition: 'color 0.2s'}}
          onMouseEnter={(e) => e.currentTarget.style.color = '#1c1917'}
          onMouseLeave={(e) => e.currentTarget.style.color = ''}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="transition-transform" style={{width: '1rem', height: '1rem'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-0.25rem)'} onMouseLeave={(e) => e.currentTarget.style.transform = ''}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Archives
        </button>

        <div className="bg-white">
            <span className="fs-6 fw-bold text-uppercase d-block mb-2" style={{letterSpacing: '0.25em', color: '#b45309'}}>Acquisitions Desk</span>
            <h1 className="fs-1 mb-3" style={{fontFamily: 'serif', color: '#1c1917'}}>Submit a Discovery</h1>
            <p className="fs-6 text-muted mb-5">
                Have you uncovered a new paper, artifact, or theory? Submit your findings to our editorial board for review.
            </p>

            <form className="gap-5" style={{display: 'flex', flexDirection: 'column'}} onSubmit={handleSubmit}>

                <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <label className="d-block fs-6 fw-bold text-uppercase mb-2" style={{letterSpacing: '0.25em', color: '#1c1917'}}>Subject / Title *</label>
                        <input
                            type="text"
                            className="w-100 py-2 px-2 fs-6 border-bottom"
                            style={{backgroundColor: '#fdfbf7', borderColor: '#dee2e6', outline: 'none', transition: 'border-color 0.2s'}}
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            placeholder="e.g. New Scrolls of Petra"
                            onFocus={(e) => e.currentTarget.style.borderColor = '#1c1917'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#dee2e6'}
                        />
                    </div>
                    <div className="col-12 col-md-6">
                        <label className="d-block fs-6 fw-bold text-uppercase mb-2" style={{letterSpacing: '0.25em', color: '#1c1917'}}>Submitted By / Institute *</label>
                        <input
                            type="text"
                            className="w-100 py-2 px-2 fs-6 border-bottom"
                            style={{backgroundColor: '#fdfbf7', borderColor: '#dee2e6', outline: 'none', transition: 'border-color 0.2s'}}
                            value={formData.publisher}
                            onChange={(e) => setFormData({...formData, publisher: e.target.value})}
                            placeholder="e.g. Oxford History Dept."
                            onFocus={(e) => e.currentTarget.style.borderColor = '#1c1917'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#dee2e6'}
                        />
                    </div>
                  </div>

                  <div>
                        <label className="d-block fs-6 fw-bold text-uppercase mb-2" style={{letterSpacing: '0.25em', color: '#1c1917'}}>Source Link / Image URL *</label>
                        <input
                            type="url"
                            className="w-100 py-2 px-2 fs-6 border-bottom"
                            style={{backgroundColor: '#fdfbf7', borderColor: '#dee2e6', outline: 'none', transition: 'border-color 0.2s'}}
                            value={formData.link}
                            onChange={(e) => setFormData({...formData, link: e.target.value})}
                            placeholder="https://..."
                            onFocus={(e) => e.currentTarget.style.borderColor = '#1c1917'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#dee2e6'}
                        />
                  </div>

                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <label className="d-block fs-6 fw-bold text-uppercase mb-2" style={{letterSpacing: '0.25em', color: '#1c1917'}}>Era / Year</label>
                        <input type="text" className="w-100 py-2 px-2 fs-6 border-bottom" style={{backgroundColor: '#fdfbf7', borderColor: '#dee2e6', outline: 'none', transition: 'border-color 0.2s'}} value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} placeholder="e.g. 1200 BC" onFocus={(e) => e.currentTarget.style.borderColor = '#1c1917'} onBlur={(e) => e.currentTarget.style.borderColor = '#dee2e6'}/>
                    </div>
                    <div className="col-12 col-md-6">
                        <label className="d-block fs-6 fw-bold text-uppercase mb-2" style={{letterSpacing: '0.25em', color: '#1c1917'}}>Category</label>
                        <input type="text" className="w-100 py-2 px-2 fs-6 border-bottom" style={{backgroundColor: '#fdfbf7', borderColor: '#dee2e6', outline: 'none', transition: 'border-color 0.2s'}} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="e.g. Antiquity, Artifacts" onFocus={(e) => e.currentTarget.style.borderColor = '#1c1917'} onBlur={(e) => e.currentTarget.style.borderColor = '#dee2e6'}/>
                    </div>
                  </div>

                  <div>
                      <div className="d-flex justify-content-between mb-2">
                        <label className="d-block fs-6 fw-bold text-uppercase" style={{letterSpacing: '0.25em', color: '#1c1917'}}>Description *</label>
                        <span className="fs-6" style={{color: formData.description.length < 50 ? '#6c757d' : '#1c1917'}}>
                           {formData.description.length} chars
                        </span>
                      </div>
                      <textarea
                          className="w-100 py-2 px-2 fs-6 border-bottom"
                          style={{backgroundColor: '#fdfbf7', borderColor: '#dee2e6', outline: 'none', transition: 'border-color 0.2s', resize: 'none'}}
                          rows={6}
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          placeholder="Detail the historical significance of this finding."
                          onFocus={(e) => e.currentTarget.style.borderColor = '#1c1917'}
                          onBlur={(e) => e.currentTarget.style.borderColor = '#dee2e6'}
                      />
                  </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-light border-start border-danger fs-6 text-danger" style={{borderWidth: '2px'}}>
                    {errorMessage}
                </div>
              )}

              <button
                type="submit"
                className="w-100 py-3 text-white fs-6 fw-bold text-uppercase rounded-pill shadow"
                style={{backgroundColor: '#1c1917', letterSpacing: '0.25em', transition: 'background-color 0.2s'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#44403c'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1c1917'}
              >
                Submit for Archival
              </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
