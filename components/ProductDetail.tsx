/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Paper } from '../types';
import { getPublisherInfo, GLOSSARY } from '../constants';
import ProductCard from './ProductCard';

interface ProductDetailProps {
  product: Paper;
  relatedPapers: Paper[];
  onBack: () => void;
  onToggleSave: (paper: Paper) => void;
  isSaved: boolean;
  onPublisherClick?: (name: string) => void;
  onProductClick: (paper: Paper) => void;
}

// Helper component to render text with glossary tooltips
const TextWithTooltips: React.FC<{ text: string }> = ({ text }) => {
  const processedContent = useMemo(() => {
    // Escape special regex characters
    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Sort keys by length (descending) to match longest phrases first
    const keys = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
    const pattern = new RegExp(`\\b(${keys.map(escapeRegExp).join('|')})\\b`, 'gi');

    const parts = text.split(pattern);
    
    return parts.map((part, index) => {
      // Check if part matches a glossary key (case-insensitive)
      const matchedKey = keys.find(key => key.toLowerCase() === part.toLowerCase());
      
      if (matchedKey) {
        return (
          <span key={index} className="tooltip-trigger d-inline-block">
            {part}
            <span className="tooltip-content">
              {GLOSSARY[matchedKey]}
            </span>
          </span>
        );
      }
      return part;
    });
  }, [text]);

  return <p>{processedContent}</p>;
};

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  relatedPapers,
  onBack, 
  onToggleSave, 
  isSaved,
  onProductClick
}) => {
  const publisherInfo = getPublisherInfo(product.publisher);

  return (
    <div className="min-vh-100 pt-5 pb-5 px-4 position-relative overflow-hidden" style={{paddingBottom: '6rem', animation: 'fadeInUp 0.6s ease-out'}}>
      
      {/* 3D Decorative Floating Coins/Shapes */}
      <div className="position-absolute opacity-10 pointer-events-none" style={{top: '5rem', right: '-5%', width: '16rem', height: '16rem', borderRadius: '50%', background: 'linear-gradient(to bottom right, #FFB673, #FFD447)', filter: 'blur(64px)', animation: 'float 6s ease-in-out infinite'}}></div>
      <div className="position-absolute opacity-10 pointer-events-none" style={{bottom: '10rem', left: '-5%', width: '20rem', height: '20rem', borderRadius: '50%', background: 'linear-gradient(to top right, #6A4FBF, #2AB9A9)', filter: 'blur(64px)', animation: 'float 6s ease-in-out infinite 2s'}}></div>

      <div className="mx-auto position-relative" style={{maxWidth: '1000px', zIndex: 10}}>
        
        {/* Navigation */}
        <button 
            onClick={onBack}
            className="d-flex align-items-center gap-2 fw-bold text-muted mb-4"
            style={{transition: 'color 0.2s'}}
            onMouseEnter={(e) => e.currentTarget.style.color = '#6A4FBF'}
            onMouseLeave={(e) => e.currentTarget.style.color = ''}
        >
            <div className="rounded-circle bg-white d-flex align-items-center justify-content-center shadow-sm" style={{width: '2rem', height: '2rem', transition: 'box-shadow 0.2s'}}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{width: '1rem', height: '1rem'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
            </div>
            Back to Modules
        </button>

        {/* Main Content Card */}
        <div className="clay-card p-4 p-md-5 position-relative overflow-hidden" style={{background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)'}}>
            {/* Header */}
            <div className="d-flex flex-column flex-md-row gap-4 align-items-start mb-5">
                <div className="d-flex align-items-center justify-content-center text-white fs-1 fw-bold flex-shrink-0" style={{width: '6rem', height: '6rem', borderRadius: '30px', backgroundColor: publisherInfo.color, boxShadow: '10px 10px 20px #d1d5db, -10px -10px 20px #ffffff'}}>
                    {publisherInfo.logo}
                </div>
                <div className="flex-fill">
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                             <h1 className="fs-1 fs-md-2 fw-bolder mb-2" style={{color: '#4A4A4A'}}>{product.title}</h1>
                             <div className="d-flex gap-3 fs-6 fw-semibold text-muted">
                                 <span className="clay-tag px-2 py-1 rounded-3">{product.publisher}</span>
                                 <span className="clay-tag px-2 py-1 rounded-3">Ages {product.publicationDate}</span>
                                 <span className="px-2 py-1 rounded-3 shadow-sm" style={{backgroundColor: '#e6fffa', color: '#2AB9A9'}}>Verified Curriculum</span>
                             </div>
                        </div>
                        <button 
                            onClick={() => onToggleSave(product)}
                            className="d-flex align-items-center justify-content-center rounded-circle" style={{width: '3.5rem', height: '3.5rem', transition: 'all 0.2s', boxShadow: '6px 6px 12px #d1d5db, -6px -6px 12px #ffffff', backgroundColor: isSaved ? '#FFD447' : '#F8E9DD', color: isSaved ? 'white' : '', animation: isSaved ? 'pop 0.3s' : ''}}
                            onMouseEnter={(e) => !isSaved && (e.currentTarget.style.color = '#6A4FBF')}
                            onMouseLeave={(e) => !isSaved && (e.currentTarget.style.color = '')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{width: '1.5rem', height: '1.5rem'}}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Price Block -> Learning Stats */}
            <div className="row g-3 mb-5">
                <div className="col-12 col-md-4">
                    <div className="rounded-3 p-3 shadow-sm" style={{backgroundColor: '#F8E9DD'}}>
                        <span className="d-block fs-6 fw-bold text-muted mb-1">Difficulty</span>
                        <span className="clay-text-convex">
                           <span className="d-block fs-2 fw-bolder" style={{color: '#4A4A4A'}}>{product.readTime}</span>
                        </span>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="rounded-3 p-3 shadow-sm" style={{backgroundColor: '#e6fffa', border: '1px solid rgba(42, 185, 169, 0.1)'}}>
                        <span className="d-block fs-6 fw-bold mb-1" style={{color: '#2AB9A9'}}>XP Reward</span>
                        <span className="d-block fs-2 fw-bolder" style={{color: '#2AB9A9'}}>+{product.upvotes} XP</span>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="rounded-3 p-3 shadow-sm" style={{backgroundColor: '#f3e8ff', border: '1px solid rgba(106, 79, 191, 0.1)'}}>
                        <span className="d-block fs-6 fw-bold mb-1" style={{color: '#6A4FBF'}}>Est. Time</span>
                        <span className="d-block fs-2 fw-bolder" style={{color: '#6A4FBF'}}>20 Mins</span>
                    </div>
                </div>
            </div>

            {/* Description with Tooltips */}
            <div className="text-muted fw-medium mb-5" style={{maxWidth: 'none', lineHeight: 1.625}}>
                <h3 className="fw-bold fs-3 mb-3" style={{color: '#4A4A4A'}}>About This Module</h3>
                <TextWithTooltips text={product.abstract} />
                <br/>
                <TextWithTooltips text={product.description || ""} />
            </div>

            {/* Insights */}
            {product.aiInsights && (
                <div className="mb-5">
                    <h3 className="fw-bold fs-4 mb-3" style={{color: '#4A4A4A'}}>Learning Outcomes</h3>
                    <div className="row g-3">
                        {product.aiInsights.map((insight, idx) => (
                            <div key={idx} className="col-12 col-md-6">
                                <div className="d-flex align-items-start gap-3 p-3 bg-white rounded-3 border shadow-sm" style={{transition: 'box-shadow 0.2s'}} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = ''}>
                                    <div className="rounded-circle flex-shrink-0 mt-2" style={{width: '0.5rem', height: '0.5rem', backgroundColor: '#FFB673', boxShadow: '0 0 5px #FFB673'}}></div>
                                    <span className="fs-6 fw-semibold text-muted">{insight}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="d-flex flex-column flex-sm-row gap-3">
                 <button className="clay-button w-100 py-3 fw-bold fs-5" style={{backgroundColor: '#F8E9DD', color: '#4A4A4A'}}>Start Lesson</button>
                 <button className="w-100 py-3 fw-bold fs-5 rounded-pill bg-white border text-muted shadow-sm" style={{transition: 'all 0.2s'}} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8f9fa'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.boxShadow = ''; }}>Download Teacher Guide</button>
            </div>
        </div>

        {/* Related Assets Section */}
        {relatedPapers.length > 0 && (
            <div style={{marginTop: '5rem'}}>
                <h3 className="fs-3 fw-bolder mb-4 px-2" style={{color: '#4A4A4A'}}>Related Modules</h3>
                <div className="row g-4">
                    {relatedPapers.map(paper => (
                        <div key={paper.id} className="col-12 col-md-6 col-lg-4 h-100">
                            <ProductCard 
                                product={paper} 
                                onClick={onProductClick}
                                onUpvote={() => {}} 
                                isUpvoted={false}
                                onToggleSave={onToggleSave}
                                isSaved={isSaved} 
                            />
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;